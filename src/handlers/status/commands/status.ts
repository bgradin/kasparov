import { Command } from "../../../commands";
import { Message } from "../../../messages";

interface Context {
  postStatusInAllChannels: (status: string) => {};
}

export default class StatusCommand extends Command<Context> {
  type = "status";
  description = "Kasparov status";
  args = [];

  canExecute(message: Message): boolean {
    return message.command === this.type;
  }

  async execute(message: Message): Promise<void> {
    if (!this.context) {
      return;
    }

    await this.context.postStatusInAllChannels(
      "The reports of my death are greatly exaggerated. Just didn't feel like posting lately 🤷"
    );
  }
}
