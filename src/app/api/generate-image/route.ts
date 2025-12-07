
import { NextResponse } from 'next/server';
import { imageGenerationFlow } from '@/ai/genkit';
import { runFlow } from 'genkit/flow';
import { ZodError } from 'zod';
import { ImageGenerationRequestSchema } from '@/core/schemas';

/**
 * API Route para iniciar a geração de uma imagem.
 * Atua como um Controlador, responsável por validação e orquestração.
 */
export async function POST(req: Request) {
  try {
    const requestBody = await req.json();

    // 1. VALIDAÇÃO: Usa o schema Zod para validar a entrada de forma segura.
    const validationResult = ImageGenerationRequestSchema.safeParse(requestBody);

    if (!validationResult.success) {
      // Se a validação falhar, retorna uma resposta de erro clara.
      console.warn('[API_VALIDATION_ERROR]', validationResult.error.flatten());
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos.',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 2. EXECUÇÃO DO FLUXO: Inicia o fluxo Genkit diretamente.
    const { operation } = await runFlow(imageGenerationFlow, validationResult.data);

    // 3. RESPOSTA: Retorna o ID da operação para o cliente.
    return NextResponse.json({ jobId: operation.name });

  } catch (error) {
    // 4. TRATAMENTO DE ERROS: Captura erros do serviço ou da validação.
    if (error instanceof ZodError) {
      // Este bloco é um fallback, mas o safeParse já deve tratar a maioria dos casos.
      return NextResponse.json({ error: 'Erro de validação', details: error.errors }, { status: 400 });
    }

    console.error('[API_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Ocorreu uma falha inesperada no servidor ao iniciar a geração.' },
      { status: 500 }
    );
  }
}
