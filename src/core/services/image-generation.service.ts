
import { runFlow, getFlowState } from 'genkit';
import { imageGenerationFlow } from '@/ai/genkit';
import { ImageGenerationRequest } from '@/core/schemas';

/**
 * Serviço para lidar com a lógica de geração de imagens.
 */

/**
 * Inicia o flow de geração de imagem no Genkit.
 */
export async function startImageGeneration(options: ImageGenerationRequest) {
  console.log(`[SERVICE_START] Iniciando a chamada ao flow para o prompt: "${options.prompt}"`);
  try {
    const { operation } = await runFlow(imageGenerationFlow, options);
    console.log(`[SERVICE_SUCCESS] Flow iniciado com sucesso. Operation Name: ${operation.name}`);
    return operation;
  } catch (error) {
    console.error('[SERVICE_ERROR] Erro ao tentar iniciar o flow do Genkit:', error);
    throw new Error('Falha ao iniciar o flow de geração de imagem no Genkit.');
  }
}

/**
 * Consulta o estado de uma operação de geração de imagem.
 */
export async function getGenerationStatus(jobId: string) {
  console.log(`[SERVICE_STATUS] Consultando status para o Job ID: ${jobId}`);
  try {
    const flowState = await getFlowState(jobId);

    if (!flowState) {
      console.warn(`[SERVICE_WARN] Nenhum estado encontrado para o Job ID: ${jobId}`);
      return null; // O controlador tratará isso como 404
    }

    return {
      status: flowState.status,
      result: flowState.result
    };

  } catch (error) {
    console.error(`[SERVICE_STATUS_ERROR] Erro ao consultar o estado do Job ID: ${jobId}`, error);
    throw new Error('Falha ao consultar o estado da operação no Genkit.');
  }
}
