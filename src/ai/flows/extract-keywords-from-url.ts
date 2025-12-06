'use server';

/**
 * @fileOverview Extracts keywords from a given URL using AI.
 *
 * - extractKeywordsFromUrl - The main function to extract keywords from a URL.
 * - ExtractKeywordsFromUrlInput - The input type for extractKeywordsFromUrl.
 * - ExtractKeywordsFromUrlOutput - The output type containing the extracted keywords.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeywordsFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the content to extract keywords from.'),
});
export type ExtractKeywordsFromUrlInput = z.infer<typeof ExtractKeywordsFromUrlInputSchema>;

const ExtractKeywordsFromUrlOutputSchema = z.object({
  keywords: z.array(z.string()).describe('The extracted keywords from the URL content.'),
});
export type ExtractKeywordsFromUrlOutput = z.infer<typeof ExtractKeywordsFromUrlOutputSchema>;

export async function extractKeywordsFromUrl(input: ExtractKeywordsFromUrlInput): Promise<ExtractKeywordsFromUrlOutput> {
  return extractKeywordsFromUrlFlow(input);
}

const extractKeywordsPrompt = ai.definePrompt({
  name: 'extractKeywordsPrompt',
  input: {schema: ExtractKeywordsFromUrlInputSchema},
  output: {schema: ExtractKeywordsFromUrlOutputSchema},
  prompt: `You are an expert content analyst. Extract the most relevant keywords from the content of the following URL. Return a list of keywords.

URL: {{{url}}}`,
});

const extractKeywordsFromUrlFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFromUrlFlow',
    inputSchema: ExtractKeywordsFromUrlInputSchema,
    outputSchema: ExtractKeywordsFromUrlOutputSchema,
  },
  async input => {
    const {output} = await extractKeywordsPrompt(input);
    return output!;
  }
);
