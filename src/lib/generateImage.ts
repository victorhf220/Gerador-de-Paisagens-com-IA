// Módulo backend comum
import { ai } from "@/ai/genkit";
import { GenerationOptions } from "@/lib/types";

export async function generateImage(
  options: GenerationOptions
): Promise<{ imageUrl: string }> {
  const { prompt, style, aspectRatio } = options;

  // Estilo
  const stylePromptMap: Record<string, string> = {
    photorealistic: "award-winning photograph, 8k, hyperrealistic, sharp focus",
    artistic: "impressionist painting, vibrant colors, brushstrokes visible",
    fantasy: "epic fantasy digital art, cinematic lighting, artstation style",
    vintage: "vintage photograph, sepia tone, grainy, 1950s",
  };

  // Aspect ratio
  const aspectRatioMap: Record<string, string> = {
    landscape: "16:9",
    square: "1:1",
    portrait: "9:16",
  };

  const fullPrompt = `
A ${style} image of ${prompt}.
Style details: ${stylePromptMap[style] || ""}
Aspect ratio: ${aspectRatioMap[aspectRatio] || "1:1"}
`.trim();

  // Geração
  const { media } = await ai.generate({
    model: "googleai/imagen-4.0-fast-generate-001",
    prompt: fullPrompt,
    config: {
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      ],
    },
  });

  // TRATAMENTO CORRETO (URL ou BASE64)
  const imageUrl =
    media?.url ??
    (media?.inlineData
      ? `data:${media.inlineData.mimeType};base64,${media.inlineData.data}`
      : null);

  if (!imageUrl) {
    throw new Error("A geração de imagem falhou: nenhuma imagem foi retornada");
  }

  return { imageUrl };
}
