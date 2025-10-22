'use server';
/**
 * @fileOverview AI-powered bullet point generator for work experience.
 *
 * - generateQuantifiableBulletPoints - Generates quantifiable bullet points for a given work experience description.
 * - GenerateQuantifiableBulletPointsInput - The input type for the generateQuantifiableBulletPoints function.
 * - GenerateQuantifiableBulletPointsOutput - The return type for the generateQuantifiableBulletPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuantifiableBulletPointsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the work experience to generate bullet points for.'),
});
export type GenerateQuantifiableBulletPointsInput = z.infer<
  typeof GenerateQuantifiableBulletPointsInputSchema
>;

const GenerateQuantifiableBulletPointsOutputSchema = z.object({
  quantifiableBulletPoints: z
    .array(z.string())
    .describe('An array of quantifiable bullet points.'),
});
export type GenerateQuantifiableBulletPointsOutput = z.infer<
  typeof GenerateQuantifiableBulletPointsOutputSchema
>;

export async function generateQuantifiableBulletPoints(
  input: GenerateQuantifiableBulletPointsInput
): Promise<GenerateQuantifiableBulletPointsOutput> {
  return generateQuantifiableBulletPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuantifiableBulletPointsPrompt',
  input: {schema: GenerateQuantifiableBulletPointsInputSchema},
  output: {schema: GenerateQuantifiableBulletPointsOutputSchema},
  prompt: `You are an expert resume writer specializing in creating impactful bullet points that highlight achievements with quantifiable results.  
  Given the following job description, generate 3-5 bullet points that showcase the candidate's contributions using numbers, percentages, or other measurable metrics.

Job Description: {{{jobDescription}}}`,
});

const generateQuantifiableBulletPointsFlow = ai.defineFlow(
  {
    name: 'generateQuantifiableBulletPointsFlow',
    inputSchema: GenerateQuantifiableBulletPointsInputSchema,
    outputSchema: GenerateQuantifiableBulletPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
