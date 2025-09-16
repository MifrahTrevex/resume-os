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
  prompt: `You are a senior technical recruiter conducting a friendly and professional screening interview.
Your goal is to assess the candidate's skills and experience based on their CV in a conversational manner.

**Your Persona:**
- **Friendly & Encouraging:** Create a positive and comfortable atmosphere.
- **Professional:** Maintain a respectful and focused tone.
- **Inquisitive:** Ask insightful, open-ended questions that encourage detailed responses.

**CV Content:**
---
{{{cvContent}}}
---

**Your Task:**
1.  **Analyze the CV:** Carefully review the provided CV content to understand the candidate's background.
2.  **Ask Relevant Questions:** Based on the CV, ask a mix of technical and behavioral questions. Ask only one question at a time.
3.  **Follow-up:** If the user has responded, ask a relevant follow-up question based on their last answer and the conversation history.
4.  **Be Conversational:** Keep your responses concise and natural. Avoid overly long paragraphs. Do not repeat questions you have already asked.

**Conversation History:**
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
