
import * as z from 'zod';

// A única fonte de verdade para a validação dos dados de entrada da geração de imagens.
export const ImageGenerationRequestSchema = z.object({
  prompt: z
    .string({
      required_error: 'O prompt é obrigatório.',
      invalid_type_error: 'O prompt deve ser um texto.',
    })
    .min(10, { message: 'O prompt deve ter pelo menos 10 caracteres.' })
    .max(500, { message: 'O prompt não pode exceder 500 caracteres.' }),

  style: z.enum(['Vibrante', 'Fotorealista', 'Minimallista', 'Fantasia'], {
    required_error: 'O estilo é obrigatório.',
    invalid_type_error: 'Selecione um estilo válido.',
  }),

  aspectRatio: z.enum(['1:1', '16:9', '9:16'], {
    required_error: 'A proporção é obrigatória.',
    invalid_type_error: 'Selecione uma proporção válida.',
  }),
});

// O TypeScript infere o tipo diretamente do schema Zod.
// Isso evita a necessidade de declarar uma interface separada, eliminando a duplicação.
export type ImageGenerationRequest = z.infer<typeof ImageGenerationRequestSchema>;
