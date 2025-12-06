import { NextResponse } from 'next/server';
import { generateImage as generateImageWithAI } from '@/lib/generateImage';
import type { GenerationOptions, GeneratedImage } from '@/lib/types';

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

    // --- SIMULAÇÃO DE API ---
    // A linha abaixo foi comentada para evitar o erro de faturamento.
    // Em vez disso, retornamos uma imagem de placeholder para permitir o teste da UI.
    // const result = await generateImageWithAI(options);

    const simulatedResult = {
      // Usamos o prompt para gerar uma imagem diferente a cada vez na simulação
      imageUrl: `https://picsum.photos/seed/${options.prompt.length}/${options.aspectRatio === 'landscape' ? 1024 : 768}/${options.aspectRatio === 'portrait' ? 1024 : 768}`
    };
    // --- FIM DA SIMULAÇÃO ---


    // ✅ LOG ESTRATÉGICO: Resposta da IA (URL)
    console.log(`[API_GENERATE_IMAGE] Imagem simulada gerada com sucesso. URL: ${simulatedResult.imageUrl}`);

    // ✅ RETORNA APENAS O CAMPO ESSENCIAL
    return NextResponse.json({ imageUrl: simulatedResult.imageUrl });

  } catch (error: any) {
    // ✅ LOG ESTRATÉGICO: Erro completo
    console.error('[API_GENERATE_IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao gerar a imagem' },
      { status: 500 }
    );
  }
}
