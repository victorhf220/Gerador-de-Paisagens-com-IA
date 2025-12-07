
import { GEMINI_PRO, googleAI } from '@genkit-ai/google-ai';
import { configureGenkit, defineFlow, run } from 'genkit';
import { z } from 'zod';
import { ImageGenerationRequestSchema } from '@/core/schemas';

configureGenkit({
  plugins: [
    googleAI({
      apiVersion: 'v1',
    }),
  ],
  logSinker: 'json',
  enableTracingAndMetrics: true,
});

export const imageGenerationFlow = defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationRequestSchema,
    outputSchema: z.string().url(),
  },
  async (options) => {
    console.log(`[GENKIT_FLOW_START] imageGenerationFlow com prompt: "${options.prompt}", estilo: "${options.style}"`);

    try {
      const llmResponse = await run('call-llm', async () => {
        const result = await googleAI().generateImage({
          model: GEMINI_PRO,
          prompt: `
            Crie uma imagem de uma paisagem com o seguinte tema: ${options.prompt}. 
            Estilo: ${options.style}. 
            Proporção: ${options.aspectRatio}
          `,
        });

        const imageUrl = result.images[0]?.url;

        if (!imageUrl) {
          throw new Error('A API não retornou uma URL de imagem.');
        }

        return imageUrl;
      });

      return llmResponse;

    } catch (error) {
      console.error('[GENKIT_FLOW_ERROR] Falha na execução do imageGenerationFlow:', error);
      throw error;
    }
  }
);
