'use server';
/**
 * @fileOverview Summarizes content from a given URL.
 *
 * - summarizeContentFromUrl - A function that takes a URL and returns a summary of the content.
 * - SummarizeContentFromUrlInput - The input type for the summarizeContentFromUrl function.
 * - SummarizeContentFromUrlOutput - The return type for the summarizeContentFromUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the content to summarize.'),
  customPrompt: z.string().optional().describe('Optional custom prompt to modify the summarization.'),
});

export type SummarizeContentFromUrlInput = z.infer<typeof SummarizeContentFromUrlInputSchema>;

const SummarizeContentFromUrlOutputSchema = z.object({
  summary: z.string().describe('The summary of the content from the URL.'),
});

export type SummarizeContentFromUrlOutput = z.infer<typeof SummarizeContentFromUrlOutputSchema>;

export async function summarizeContentFromUrl(input: SummarizeContentFromUrlInput): Promise<SummarizeContentFromUrlOutput> {
  return summarizeContentFromUrlFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: SummarizeContentFromUrlInputSchema},
  output: {schema: SummarizeContentFromUrlOutputSchema},
  prompt: `You are an expert content summarizer.  Summarize the content from the URL below, extracting the key information and main points.  If a custom prompt is provided, use it to modify your summarization.

Content from URL: {{{url}}}

{{#if customPrompt}}
Custom Prompt: {{{customPrompt}}}
{{/if}}`,
});

const summarizeContentFromUrlFlow = ai.defineFlow(
  {
    name: 'summarizeContentFromUrlFlow',
    inputSchema: SummarizeContentFromUrlInputSchema,
    outputSchema: SummarizeContentFromUrlOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentPrompt(input);
    if (!output) {
      throw new Error('Could not generate summary from URL.');
    }
    return output;
  }
);
