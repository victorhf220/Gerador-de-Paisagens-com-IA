
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerationOptions, ArtStyle, AspectRatio } from '@/lib/types';

const ImageGenerationInputSchema = z.object({
  prompt: z.string(),
  style: z.enum(['Photorealistic', 'Artistic', 'Fantasy', 'Vintage']),
  aspectRatio: z.enum(['16:9', '1:1', '9:16']),
});

export async function generateImageFlow(options: GenerationOptions): Promise<{ imageUrl: string } | undefined> {
  const { prompt, style, aspectRatio } = options;

  let stylePrompt = '';
  if (style === 'Photorealistic') {
    stylePrompt = 'award-winning photograph, 8k, hyperrealistic, sharp focus';
  } else if (style === 'Artistic') {
    stylePrompt = 'impressionist painting, vibrant colors, brushstrokes visible';
  } else if (style === 'Fantasy') {
    stylePrompt = 'epic fantasy digital art, trending on artstation, cinematic lighting';
  } else if (style === 'Vintage') {
    stylePrompt = 'vintage photograph, sepia tone, grainy, 1950s';
  }

  const fullPrompt = `Generate an image of: ${prompt}. The image should be in a ${style.toLowerCase()} style. ${stylePrompt}. The aspect ratio should be ${aspectRatio}.`;

  const { media } = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
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
    return await generateImageFlow(options);
  }
);
