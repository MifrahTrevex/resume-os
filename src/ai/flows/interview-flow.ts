'use server';
/**
 * @fileOverview An AI agent that acts as an interviewer based on CV content.
 *
 * - interview - A function that handles the interview conversation.
 * - InterviewInput - The input type for the interview function.
 * - InterviewOutput - The return type for the interview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const InterviewInputSchema = z.object({
  cvContent: z.string().describe('The full content of the CV in JSON format.'),
  history: z.array(MessageSchema).describe('The conversation history.'),
});
export type InterviewInput = z.infer<typeof InterviewInputSchema>;

const InterviewOutputSchema = z.object({
  response: z.string().describe("The interviewer's response."),
});
export type InterviewOutput = z.infer<typeof InterviewOutputSchema>;

export async function interview(input: InterviewInput): Promise<InterviewOutput> {
  return interviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewPrompt',
  input: {schema: InterviewInputSchema},
  output: {schema: InterviewOutputSchema},
  prompt: `You are a friendly, professional interviewer conducting a brief, high-level screening interview.
Your goal is to get to know the candidate based on their CV.

Here is the candidate's CV content:
---
{{{cvContent}}}
---

Based on the CV, ask one insightful question to start the conversation.
Keep your responses concise and conversational.
Do not repeat questions.
Here is the conversation history so far:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
`,
});

const interviewFlow = ai.defineFlow(
  {
    name: 'interviewFlow',
    inputSchema: InterviewInputSchema,
    outputSchema: InterviewOutputSchema,
  },
  async (input: InterviewInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
