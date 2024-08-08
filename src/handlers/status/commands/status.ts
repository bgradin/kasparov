import { ChannelType } from "discord.js";
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
    return (
      message.command === this.type &&
      (message.channel.type === ChannelType.GuildAnnouncement ||
        message.channel.type === ChannelType.GuildText)
    );
  }

  async execute(): Promise<void> {
    if (!this.context) {
      return;
    }

    await this.context.postStatusInAllChannels(
      "I'm fine, chill. Just didn't feel like it lately 🤷"
    );
  }
}
