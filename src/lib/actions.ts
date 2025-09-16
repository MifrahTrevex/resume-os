"use server";

import { interpretTerminalCommand } from "@/ai/flows/terminal-command-interpretation";

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
