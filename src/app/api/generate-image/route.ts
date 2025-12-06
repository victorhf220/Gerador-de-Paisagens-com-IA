import { NextResponse } from 'next/server';
import { generateImage as generateImageWithAI } from '@/lib/generateImage';
import type { GenerationOptions } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const options: GenerationOptions = await req.json();

    // Validação básica das opções
    if (!options.prompt || !options.style || !options.aspectRatio) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos para a geração' },
        { status: 400 }
      );
    }
    
    // Chama a função de geração de imagem real
    const result = await generateImageWithAI(options);

    const imageResponse = {
      id: crypto.randomUUID(),
      url: result.imageUrl,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(imageResponse);

  } catch (error: any) {
    console.error('[API_GENERATE_IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao gerar a imagem' },
      { status: 500 }
    );
  }
}
