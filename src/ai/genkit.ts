
import { configureGenkit, genkit } from 'genkit';
import { defineFlow, run } from 'genkit/flow';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { GenerationOptions, ArtStyle, AspectRatio } from '@/lib/types';

configureGenkit({
  plugins: [
    googleAI({
      apiKey: () => process.env.NANO_BANANA_API_KEY || ''
    }),
  ],
  logSinks: [process.env.NODE_ENV === 'dev' ? 'stdout' : 'firebase'],
  enableTracingAndMetrics: true,
});

export const imageGenerationFlow = defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: z.custom<GenerationOptions>(),
    outputSchema: z.object({ imageUrl: z.string() }),
  },
  async (options) => {
    return await run('generate-image-logic', async () => {
      const { prompt, style, aspectRatio } = options;

      const stylePromptMap: Record<string, string> = {
        photorealistic: "award-winning photograph, 8k, hyperrealistic, sharp focus",
        artistic: "impressionist painting, vibrant colors, brushstrokes visible",
        fantasy: "epic fantasy digital art, cinematic lighting, artstation style",
        vintage: "vintage photograph, sepia tone, grainy, 1950s",
      };

      const aspectRatioMap: Record<string, string> = {
        landscape: "16:9",
        square: "1:1",
        portrait: "9:16",
      };

      const fullPrompt = `
A ${style} image of ${prompt}.
Style details: ${stylePromptMap[style] || ""}
Aspect ratio: ${aspectRatioMap[aspectRatio] || "1:1"}
`.trim();

      const { media } = await genkit.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: fullPrompt,
        config: {
          safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          ],
        },
      });

      const imageUrl =
        media?.url ??
        (media?.inlineData
          ? `data:${media.inlineData.mimeType};base64,${media.inlineData.data}`
          : null);

      if (!imageUrl) {
        throw new Error("Image generation failed: no image was returned");
      }

      return { imageUrl };
    });
  }
);
