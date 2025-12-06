
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
        callBackUrl: "https://dummy-callback.com/callback" // Placeholder
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nano Banana API error:", errorText);
      throw new Error(`Nano Banana API request failed with status ${response.status}`);
    }

    const result = await response.json();
    // Assuming the API returns a task ID to check for completion
    return { imageUrl: '', taskId: result.taskId || 'polling-simulation' }; 
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

const definedFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: z.object({ imageUrl: z.string(), taskId: z.string().optional() }),
  },
  async (options) => {
    return await generateImageFlow(options as GenerationOptions);
  }
);

// A new flow to check the status of a generation task from the new API
export async function checkImageStatusFlow(taskId: string): Promise<{ imageUrl: string } | undefined> {
  // This is a placeholder for where you would poll the Nano Banana API status endpoint
  // Since we don't have a real status endpoint, we'll simulate a delay and return a mock image
  await new Promise(resolve => setTimeout(resolve, 10000)); // Simulate 10-second generation time
  
  const mockImageUrl = `https://picsum.photos/seed/${taskId}/1024/768`;
  return { imageUrl: mockImageUrl };
}

ai.defineFlow(
  {
    name: 'checkImageStatusFlow',
    inputSchema: z.string(),
    outputSchema: z.object({ imageUrl: z.string() }),
  },
  async (taskId) => {
    return await checkImageStatusFlow(taskId);
  }
);
