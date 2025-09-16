"use server";

import { interpretTerminalCommand } from "@/ai/flows/terminal-command-interpretation";
import { interview, type InterviewInput } from "@/ai/flows/interview-flow";
import { textToSpeech, type TextToSpeechInput } from "@/ai/flows/text-to-speech-flow";

export async function handleCommand(command: string) {
  try {
    const result = await interpretTerminalCommand({ command });
    return result;
  } catch (error) {
    console.error("Error interpreting command:", error);
    return {
      action: "INVALID",
      reason: "An error occurred while processing the command.",
    };
  }
}

export async function handleInterview(input: InterviewInput) {
    try {
        const result = await interview(input);
        return result;
    } catch (error) {
        console.error("Error with interview flow:", error);
        return {
            response: "Sorry, I encountered an error. Please try again.",
        };
    }
}

export async function handleTextToSpeech(input: TextToSpeechInput) {
    try {
        const result = await textToSpeech(input);
        return result;
    } catch (error) {
        console.error("Error with TTS flow:", error);
        return {
            media: "",
        };
    }
}
