'use server';

/**
 * @fileOverview Allows users to customize the summarization behavior with a custom prompt.
 *
 * - customizeSummaryWithPrompt - A function that handles the summarization process with a custom prompt.
 * - CustomizeSummaryWithPromptInput - The input type for the customizeSummaryWithPrompt function.
 * - CustomizeSummaryWithPromptOutput - The return type for the customizeSummaryWithPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeSummaryWithPromptInputSchema = z.object({
  content: z.string().describe('The content to be summarized.'),
  customPrompt: z
    .string()
    .describe(
      'A custom prompt to tailor the summarization to specific needs. If empty, a default summarization prompt is used.'
    )
    .optional(),
});
export type CustomizeSummaryWithPromptInput = z.infer<typeof CustomizeSummaryWithPromptInputSchema>;

const CustomizeSummaryWithPromptOutputSchema = z.object({
  summary: z.string().describe('The summarized content.'),
});
export type CustomizeSummaryWithPromptOutput = z.infer<typeof CustomizeSummaryWithPromptOutputSchema>;

export async function customizeSummaryWithPrompt(
  input: CustomizeSummaryWithPromptInput
): Promise<CustomizeSummaryWithPromptOutput> {
  return customizeSummaryWithPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeSummaryWithPromptPrompt',
  input: {schema: CustomizeSummaryWithPromptInputSchema},
  output: {schema: CustomizeSummaryWithPromptOutputSchema},
  prompt: `You are an expert summarizer. Your goal is to provide concise and informative summaries of the provided content.

  Content: {{{content}}}

  {% if customPrompt %}
  Custom Instructions: {{{customPrompt}}}
  {% else %}
  Summarize the content in a clear and concise manner.
  {% endif %}`,
});

const customizeSummaryWithPromptFlow = ai.defineFlow(
  {
    name: 'customizeSummaryWithPromptFlow',
    inputSchema: CustomizeSummaryWithPromptInputSchema,
    outputSchema: CustomizeSummaryWithPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
