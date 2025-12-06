
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerationOptions } from '@/lib/types';

const ImageGenerationInputSchema = z.object({
  prompt: z.string(),
  style: z.enum(['photorealistic', 'artistic', 'fantasy', 'vintage']),
  aspectRatio: z.enum(['landscape', 'square', 'portrait']),
  aiModel: z.enum(['standard', 'nano_banana']).optional(),
});

export async function generateImageFlow(options: GenerationOptions): Promise<{ imageUrl: string } | undefined> {
  const { prompt, style, aspectRatio } = options;

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

  const model = 'googleai/imagen-4.0-fast-generate-001';

  const { media } = await ai.generate({
    model,
    prompt: fullPrompt,
    config: {
       safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
         {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
         {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
      ],
    }
  });

  const imageUrl = media.url;
  if (!imageUrl) {
    throw new Error('Image generation failed.');
  }

  return { imageUrl };
}

const definedFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: z.object({ imageUrl: z.string() }),
  },
  async (options) => {
    return await generateImageFlow(options as GenerationOptions);
  }
);
