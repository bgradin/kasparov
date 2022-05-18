import { Command } from "../../../commands";
import { Message } from "../../../messages";

export default class SolveDailyPuzzleCommand extends Command {
  type = "solve";
  description = "Solves a puzzle";
  args = [
    {
      name: "solution",
      description: "Proposed solution for the current daily puzzle",
    },
  ];

  canExecute(message: Message): boolean {
    return message.command === this.type;
  }

  async execute(message: Message) {}
}
