'use server';
/**
 * @fileOverview A flow to generate landscape images based on a prompt and style.
 *
 * - generateImageFlow - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImageFlow function.
 * - GenerateImageOutput - The return type for the generateImageFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The detailed description of the landscape to generate.'),
  style: z.string().describe('The artistic style of the image.'),
  aspectRatio: z.string().describe('The aspect ratio for the generated image.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImageFlow(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImage(input);
}

const generateImage = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    // For now, we'll use a placeholder image service.
    // In a real scenario, this would call a text-to-image model.
    const seed = Math.random().toString(36).substring(7);
    const [width, height] = input.aspectRatio === '16:9' ? [1280, 720]
                           : input.aspectRatio === '1:1' ? [1024, 1024]
                           : [720, 1280];

    // Using picsum.photos for dynamic placeholders based on a seed.
    const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

    return {
      imageUrl,
    };
  }
);
