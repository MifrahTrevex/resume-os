'use server';

/**
 * @fileOverview A terminal command interpretation AI agent.
 *
 * - interpretTerminalCommand - A function that interprets terminal commands and suggests actions.
 * - InterpretTerminalCommandInput - The input type for the interpretTerminalCommand function.
 * - InterpretTerminalCommandOutput - The return type for the interpretTerminalCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretTerminalCommandInputSchema = z.object({
  command: z.string().describe('The command entered by the user in the terminal.'),
});
export type InterpretTerminalCommandInput = z.infer<typeof InterpretTerminalCommandInputSchema>;

const InterpretTerminalCommandOutputSchema = z.object({
  action: z
    .string()
    .describe(
      'The action to be taken by the application based on the command.  Possible values include: OPEN_RESUME, SHOW_PROJECTS, OPEN_LINK, SHOW_HELP, INVALID'
    ),
  link: z.string().optional().describe('The link to open if the action is OPEN_LINK'),
  reason: z.string().describe('The reasoning behind the action taken.'),
});
export type InterpretTerminalCommandOutput = z.infer<typeof InterpretTerminalCommandOutputSchema>;

export async function interpretTerminalCommand(input: InterpretTerminalCommandInput): Promise<InterpretTerminalCommandOutput> {
  return interpretTerminalCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretTerminalCommandPrompt',
  input: {schema: InterpretTerminalCommandInputSchema},
  output: {schema: InterpretTerminalCommandOutputSchema},
  prompt: `You are a terminal command interpreter for a personal CV website. You must decide what action the user wants to take based on their command.

Valid actions are:
- OPEN_RESUME: to open the resume PDF. Use this action if the user asks to see the resume, CV or work experience.
- SHOW_PROJECTS: to display the portfolio of projects. Use this action if the user asks to see projects or portfolio.
- OPEN_LINK: to open an external link, such as LinkedIn or Github. The specific link must be determined and included in the output.
- SHOW_HELP: to display the help message with all available commands. Use this action if the user types 'help'.
- INVALID: if the command is not recognized or is not related to the CV content or navigation.

Given the following command, determine the appropriate action and provide a reason for your choice.

Command: {{{command}}}

Your response must be in JSON format.
`,
});

const interpretTerminalCommandFlow = ai.defineFlow(
  {
    name: 'interpretTerminalCommandFlow',
    inputSchema: InterpretTerminalCommandInputSchema,
    outputSchema: InterpretTerminalCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
