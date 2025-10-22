'use server';

/**
 * @fileOverview AI flow to suggest relevant keywords extracted from job descriptions.
 *
 * - suggestRelevantKeywords - A function that suggests keywords based on a job description.
 * - SuggestRelevantKeywordsInput - The input type for the suggestRelevantKeywords function.
 * - SuggestRelevantKeywordsOutput - The return type for the suggestRelevantKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantKeywordsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to extract keywords from.'),
});
export type SuggestRelevantKeywordsInput = z.infer<
  typeof SuggestRelevantKeywordsInputSchema
>;

const SuggestRelevantKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('An array of relevant keywords extracted from the job description.'),
});
export type SuggestRelevantKeywordsOutput = z.infer<
  typeof SuggestRelevantKeywordsOutputSchema
>;

export async function suggestRelevantKeywords(
  input: SuggestRelevantKeywordsInput
): Promise<SuggestRelevantKeywordsOutput> {
  return suggestRelevantKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantKeywordsPrompt',
  input: {schema: SuggestRelevantKeywordsInputSchema},
  output: {schema: SuggestRelevantKeywordsOutputSchema},
  prompt: `You are an AI resume expert. Extract keywords from the job description that a candidate can use to tailor their resume to the job description. Return the keywords as an array of strings.

Job Description: {{{jobDescription}}}`,
});

const suggestRelevantKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantKeywordsFlow',
    inputSchema: SuggestRelevantKeywordsInputSchema,
    outputSchema: SuggestRelevantKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
