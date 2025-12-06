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
    
    // ✅ LOG ESTRATÉGICO: Início da requisição
    console.log(`[API_GENERATE_IMAGE] Iniciando geração com prompt: "${options.prompt}"`);

    // Chama a função de geração de imagem real
    const result = await generateImageWithAI(options);

    // ✅ LOG ESTRATÉGICO: Resposta da IA (URL)
    console.log(`[API_GENERATE_IMAGE] Imagem gerada com sucesso. URL (início): ${result.imageUrl.substring(0, 100)}...`);

    // ✅ RETORNA APENAS O CAMPO ESSENCIAL
    return NextResponse.json({ imageUrl: result.imageUrl });

  } catch (error: any) {
    // ✅ LOG ESTRATÉGICO: Erro completo
    console.error('[API_GENERATE_IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao gerar a imagem' },
      { status: 500 }
    );
  }
}
