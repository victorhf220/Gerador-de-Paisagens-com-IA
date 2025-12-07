
import { NextResponse } from 'next/server';
import { getFlowState } from 'genkit';
import '@/ai/genkit'; // Importa para garantir que a configuração do Genkit seja executada

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID é obrigatório' }, { status: 400 });
  }

  try {
    console.log(`[API_STATUS] Verificando status para o job: ${jobId}`);
    const flowState = await getFlowState(jobId);

    if (!flowState) {
      console.warn(`[API_STATUS] Job não encontrado: ${jobId}`);
      return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 });
    }

    console.log(`[API_STATUS] Status do job ${jobId}: ${flowState.status}`);

    switch (flowState.status) {
      case 'pending':
      case 'running':
        return NextResponse.json({ status: 'pending' }, { status: 202 });
      case 'done':
        const result = flowState.result as { imageUrl: string };
        if (result?.imageUrl) {
          console.log(`[API_STATUS] Job ${jobId} concluído. URL: ${result.imageUrl}`);
          return NextResponse.json({ status: 'complete', imageUrl: result.imageUrl });
        }
        console.error(`[API_STATUS] Job ${jobId} concluído, mas sem URL.`);
        return NextResponse.json({ status: 'failed', error: 'Resultado da geração inválido' }, { status: 500 });
      case 'error':
        console.error(`[API_STATUS] Job ${jobId} falhou. Erro: ${flowState.error?.message}`);
        return NextResponse.json({ status: 'failed', error: flowState.error?.message || 'Geração falhou' }, { status: 500 });
      default:
        console.error(`[API_STATUS] Status desconhecido para o job ${jobId}: ${flowState.status}`);
        return NextResponse.json({ status: 'failed', error: 'Status do job desconhecido' }, { status: 500 });
    }
  } catch (error: any) {
    console.error(`[API_STATUS_ERROR] Erro ao buscar o job ${jobId}:`, error);
    if (error.message?.includes('No such operation')) {
      return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ status: 'failed', error: 'Erro interno ao verificar o status da geração' }, { status: 500 });
  }
}
