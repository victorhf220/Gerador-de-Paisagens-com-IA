"use server";

import { z } from "zod";
import { summarizeContentFromUrl } from "@/ai/flows/summarize-content-from-url";
import { extractKeywordsFromUrl } from "@/ai/flows/extract-keywords-from-url";

const schema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  customPrompt: z.string().optional(),
});

export type FormState = {
  message: string;
  data?: {
    url: string;
    summary: string;
    keywords: string[];
  };
  success: boolean;
};

export async function processUrl(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    url: formData.get("url"),
    customPrompt: formData.get("customPrompt"),
  });

  if (!validatedFields.success) {
    const firstError = validatedFields.error.flatten().fieldErrors.url?.[0];
    return {
      message: firstError || "Invalid input.",
      success: false,
    };
  }

  const { url, customPrompt } = validatedFields.data;

  try {
    const [summaryResult, keywordsResult] = await Promise.all([
      summarizeContentFromUrl({ url, customPrompt }),
      extractKeywordsFromUrl({ url }),
    ]);

    if (!summaryResult.summary || !keywordsResult.keywords) {
      return { message: "AI failed to process the URL. The content might be inaccessible or in an unsupported format.", success: false };
    }

    return {
      message: "Content processed successfully.",
      success: true,
      data: {
        url,
        summary: summaryResult.summary,
        keywords: keywordsResult.keywords,
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { 
      message: `An error occurred: ${errorMessage}`,
      success: false 
    };
  }
}
