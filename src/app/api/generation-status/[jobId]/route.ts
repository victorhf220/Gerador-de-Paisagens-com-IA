
import { NextResponse } from 'next/server';
import { SIMULATED_JOBS } from '@/lib/jobs';

const SIMULATION_DELAY = 8000; // Simula 8 segundos de processamento de IA

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID é obrigatório' }, { status: 400 });
  }

  const job = SIMULATED_JOBS.get(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 });
  }

  // --- SIMULAÇÃO DE PROCESSAMENTO DE IA ---

  // Se o trabalho já foi concluído, retorne o resultado imediatamente.
  if (job.status === 'complete') {
    console.log(`[API_STATUS] Job ${jobId} já completo. Retornando URL.`);
    return NextResponse.json({ status: 'complete', imageUrl: job.imageUrl });
  }

  // Se o trabalho falhou anteriormente, retorne o erro.
  if (job.status === 'failed') {
    return NextResponse.json({ status: 'failed', error: 'Geração falhou' }, { status: 500 });
  }
  
  // Verifique se o tempo de simulação passou.
  const elapsedTime = Date.now() - job.startTime;

  if (elapsedTime < SIMULATION_DELAY) {
    // Se o tempo ainda não passou, retorne "pending".
    console.log(`[API_STATUS] Job ${jobId} ainda está em andamento...`);
    return NextResponse.json({ status: 'pending' }, { status: 202 }); // 202 Accepted indica que a requisição foi aceita mas não concluída.
  }

  // O tempo de simulação acabou. Marque o trabalho como "completo".
  console.log(`[API_STATUS] Job ${jobId} concluído. Gerando URL simulada.`);

  const aspectRatioMap: Record<string, { width: number, height: number }> = {
    landscape: { width: 1024, height: 576 },
    portrait: { width: 576, height: 1024 },
    square: { width: 1024, height: 1024 }
  };
  const { width, height } = aspectRatioMap[job.options.aspectRatio] || aspectRatioMap.landscape;
  const seed = `${job.options.prompt}-${job.options.aiModel}`;
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;

  // Atualize o job no nosso "banco de dados" em memória.
  job.status = 'complete';
  job.imageUrl = imageUrl;
  SIMULATED_JOBS.set(jobId, job);

  // Retorne a resposta de sucesso.
  return NextResponse.json({ status: 'complete', imageUrl });
}
