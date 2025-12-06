
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerationOptions } from '@/lib/types';
import { GenkitError } from 'genkit';

const ImageGenerationInputSchema = z.object({
  prompt: z.string(),
  style: z.enum(['photorealistic', 'artistic', 'fantasy', 'vintage']),
  aspectRatio: z.enum(['landscape', 'square', 'portrait']),
  aiModel: z.enum(['standard', 'nano_banana']).optional(),
});

export async function generateImageFlow(options: GenerationOptions): Promise<{ imageUrl: string, taskId?: string } | undefined> {
  const { prompt, style, aspectRatio, aiModel } = options;

  if (aiModel === 'nano_banana') {
    const response = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NANO_BANANA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `A ${style.toLowerCase()} image of: ${prompt}`,
        numImages: 1,
        type: "TEXTTOIAMGE",
        image_size: aspectRatio === 'landscape' ? '16:9' : aspectRatio === 'portrait' ? '9:16' : '1:1',
        callBackUrl: "https://dummy-callback.com/callback" // Placeholder, as required by API
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nano Banana API error:", errorText);
      throw new Error(`Nano Banana API request failed with status ${response.status}`);
    }

    const result = await response.json();
    if (result.code !== 200) {
        throw new Error(`Generation failed: ${result.msg || 'Unknown error'}`);
    }
    
    return { imageUrl: '', taskId: result.data.taskId };
  }

  // Fallback to standard model
  let stylePrompt = '';
  if (style === 'photorealistic') {
    stylePrompt = 'award-winning photograph, 8k, hyperrealistic, sharp focus';
  } else if (style === 'artistic') {
    stylePrompt = 'impressionist painting, vibrant colors, brushstrokes visible';
  } else if (style === 'fantasy') {
    stylePrompt = 'epic fantasy digital art, trending on artstation, cinematic lighting';
  } else if (style === 'vintage') {
    stylePrompt = 'vintage photograph, sepia tone, grainy, 1950s';
  }

  const aspectRatioText = {
    'landscape': 'in a 16:9 aspect ratio',
    'square': 'in a 1:1 aspect ratio',
    'portrait': 'in a 9:16 aspect ratio'
  }[aspectRatio];

  const fullPrompt = `A ${style.toLowerCase()} image of: ${prompt}, ${aspectRatioText}. ${stylePrompt}.`;

  const primaryModel = 'googleai/imagen-4.0-fast-generate-001';

  const commonConfig = {
    prompt: fullPrompt,
    config: {
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      ],
    }
  };

  try {
    const { media } = await ai.generate({ model: primaryModel, ...commonConfig });
    const imageUrl = media.url;
    if (!imageUrl) {
      throw new Error('Image generation failed.');
    }
    return { imageUrl };

  } catch (error) {
    if (error instanceof GenkitError && error.status === 'RESOURCE_EXHAUSTED') {
      console.log("Primary model failed due to rate limit, trying fallback (if any).");
    }
    throw error;
  }
}

ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: z.object({ imageUrl: z.string(), taskId: z.string().optional() }),
  },
  async (options) => {
    return await generateImageFlow(options as GenerationOptions);
  }
);


export async function checkImageStatusFlow(taskId: string): Promise<{ imageUrl: string | null; isComplete: boolean; error?: string }> {
  const response = await fetch(`https://api.nanobananaapi.ai/api/v1/nanobanana/record-info?taskId=${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NANO_BANANA_API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get task status');
  }

  const result = await response.json();

  switch (result.data.successFlag) {
    case 0: // Generating
      return { imageUrl: null, isComplete: false };
    case 1: // Success
      return { imageUrl: result.data.resultImageUrl, isComplete: true };
    case 2: // Fail
    case 3: // Fail
      return { imageUrl: null, isComplete: true, error: result.data.failReason || 'Generation failed' };
    default:
      return { imageUrl: null, isComplete: false };
  }
}


ai.defineFlow(
  {
    name: 'checkImageStatusFlow',
    inputSchema: z.string(),
    outputSchema: z.object({ 
      imageUrl: z.string().nullable(),
      isComplete: z.boolean(),
      error: z.string().optional(),
    }),
  },
  async (taskId) => {
    return await checkImageStatusFlow(taskId);
  }
);
