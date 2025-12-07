import { NextResponse } from 'next/server';
import { getFlowState } from 'genkit';

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'jobId é obrigatório' }, { status: 400 });
  }

  try {
    const flowState = await getFlowState(jobId);

    switch (flowState.status) {
      case 'done':
        return NextResponse.json({
          status: 'done',
          imageUrl: flowState.result,
        });
      case 'error':
        console.error(`[API_STATUS_ERROR] Flow ${jobId} falhou:`, flowState.error);
        return NextResponse.json(
          {
            status: 'error',
            error: 'A geração da imagem falhou. Tente um prompt diferente ou verifique os logs.',
            details: flowState.error,
          },
          { status: 500 }
        );
      case 'pending':
      case 'running':
        return NextResponse.json({
          status: 'pending',
        });
      default:
        // Caso um novo estado seja adicionado no futuro
        return NextResponse.json({ status: 'unknown' });
    }
  } catch (error: any) {
    console.error('[API_STATUS_CATCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao obter o status do processo' },
      { status: 500 }
    );
  }
}
