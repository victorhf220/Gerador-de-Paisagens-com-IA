import { GEMINI_PRO, googleAI } from '@genkit-ai/google-ai';
import { configureGenkit } from 'genkit';
import { defineFlow, run } from 'genkit/flow';
import { ImageGenerationRequestSchema } from '@/core/schemas'; // Importando nosso schema centralizado

// Configuração inicial do Genkit com o plugin da Google AI.
configureGenkit({
  plugins: [
    googleAI({
      apiVersion: 'v1', // Especifica a versão da API para evitar ambiguidades
    }),
  ],
  logSinker: 'json', // Formato de log estruturado, ideal para produção
  enableTracingAndMetrics: true, // Habilita tracing para depuração detalhada
});

/**
 * Flow para geração de imagens.
 * Utiliza o schema Zod para validação automática e robusta da entrada.
 */
export const imageGenerationFlow = defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationRequestSchema, // Validação de entrada com Zod
    outputSchema: z.string().url(), // Valida se a saída é uma URL válida
  },
  async (options) => {
    console.log(`[GENKIT_FLOW_START] Iniciando imageGenerationFlow com prompt: "${options.prompt}" e estilo: "${options.style}"`);

    try {
      const llmResponse = await run('call-llm', async () => {
        // Gera a imagem usando o modelo Gemini Pro.
        const result = await googleAI().generateImage({
          model: GEMINI_PRO, // Usando o modelo definido
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

      console.log('[GENKIT_FLOW_SUCCESS] imageGenerationFlow concluído com sucesso.');
      return llmResponse;

    } catch (error) {
      console.error('[GENKIT_FLOW_ERROR] Falha na execução do imageGenerationFlow:', error);
      // Lança o erro para que o status do flow seja definido como 'error'
      throw error;
    }
  }
);
