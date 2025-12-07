
import { NextResponse } from 'next/server';
import { getGenerationStatus } from '@/core/services/image-generation.service';

/**
 * API Route para verificar o status de uma operação de geração de imagem.
 */
export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID é obrigatório.' }, { status: 400 });
  }

  try {
    const statusData = await getGenerationStatus(jobId);

    if (!statusData) {
      return NextResponse.json({ error: `Operação com ID ${jobId} não encontrada.` }, { status: 404 });
    }

    // Retorna o status e o resultado (que pode ser a URL da imagem ou um erro)
    return NextResponse.json(statusData);

  } catch (error) {
    console.error(`[API_STATUS_ERROR] Erro ao obter status para o Job ID: ${jobId}`, error);
    return NextResponse.json(
      { error: 'Ocorreu uma falha inesperada no servidor ao verificar o status.' },
      { status: 500 }
    );
  }
}
