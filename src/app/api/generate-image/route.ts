
import { NextResponse } from 'next/server';
import type { GenerationOptions } from '@/lib/types';
import { SIMULATED_JOBS } from '@/lib/jobs';


export async function POST(req: Request) {
  try {
    const options: GenerationOptions = await req.json();

    if (!options.prompt || !options.style || !options.aspectRatio) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos para a geração' },
        { status: 400 }
      );
    }
    
    // ✅ LOG ESTRATÉGICO: Início da requisição assíncrona
    console.log(`[API_GENERATE_IMAGE] Requisição recebida para prompt: "${options.prompt}".`);

    // --- SIMULAÇÃO DE ARQUITETURA ASSÍNCRONA ---
    // 1. Gera um ID de trabalho único.
    const jobId = `sim_${crypto.randomUUID()}`;

    // 2. Armazena os detalhes do trabalho em memória (em um cenário real, isso seria um DB ou Redis).
    SIMULATED_JOBS.set(jobId, {
      status: 'pending',
      options,
      startTime: Date.now(),
    });
    console.log(`[API_GENERATE_IMAGE] Job ${jobId} criado e colocado na fila.`);

    // 3. Limpa jobs antigos para não encher a memória.
    if (SIMULATED_JOBS.size > 100) {
      const oldestJobId = SIMULATED_JOBS.keys().next().value;
      SIMULATED_JOBS.delete(oldestJobId);
    }
    
    // 4. Retorna o Job ID IMEDIATAMENTE para o cliente.
    // Isso evita o timeout da Vercel. A resposta é quase instantânea.
    return NextResponse.json({ jobId });

  } catch (error: any) {
    console.error('[API_GENERATE_IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao iniciar o processo de geração de imagem' },
      { status: 500 }
    );
  }
}
