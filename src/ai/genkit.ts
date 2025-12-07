import { configureGenkit, defineFlow, generate } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { geminiPro, imagen2 } from 'genkitx-googleai';
import * as z from 'zod';

configureGenkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const promptSchema = z.object({
  prompt: z.string(),
  style: z.string(),
  aspectRatio: z.string(),
});

export const imageGenerationFlow = defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: promptSchema,
    outputSchema: z.string().url(),
  },
  async (options) => {
    console.log('[GENKIT_FLOW] Iniciando imageGenerationFlow com input:', options);

    const llmResponse = await generate({
      model: geminiPro,
      prompt: `Aprimore o seguinte prompt para gerar uma imagem mais detalhada e artística, no estilo ${options.style}: "${options.prompt}"`,
      output: {
        format: 'text',
      },
    });

    const enhancedPrompt = llmResponse.text();
    console.log('[GENKIT_FLOW] Prompt aprimorado:', enhancedPrompt);

    const imageResponse = await generate({
      model: imagen2,
      prompt: enhancedPrompt,
      config: {
        aspectRatio: options.aspectRatio as '1:1' | '16:9' | '9:16',
        seed: Math.floor(Math.random() * 100000),
      },
    });

    const generatedImage = imageResponse.candidates[0];

    if (!generatedImage || !generatedImage.output) {
      console.error('[GENKIT_FLOW_ERROR] A geração de imagem não retornou um candidato válido.');
      throw new Error('Falha ao gerar a imagem. O resultado estava vazio.');
    }

    console.log('[GENKIT_FLOW] Imagem gerada com sucesso. Finish Reason:', generatedImage.finishReason);
    return generatedImage.output.url;
  }
);
