
import { NextResponse } from 'next/server';
import { runFlow } from 'genkit';
import { imageGenerationFlow } from '@/ai/genkit';

export async function POST(req: Request) {
  try {
    const options = await req.json();

    if (!options.prompt || !options.style || !options.aspectRatio) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos para a geração' },
        { status: 400 }
      );
    }

    console.log(\`[API_GENERATE_IMAGE] Requisição recebida para prompt: "${options.prompt}".\`);

    const { operation } = await runFlow(imageGenerationFlow, options);

    return NextResponse.json({ jobId: operation.name });

  } catch (error: any) {
    console.error('[API_GENERATE_IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao iniciar o processo de geração de imagem' },
      { status: 500 }
    );
  }
}
