import { NewsChannel, TextChannel } from "discord.js";
import { Command } from "../../../commands";
import { Message } from "../../../messages";

interface Context {
  postDailyPuzzleInChannel: (channel: NewsChannel | TextChannel) => {};
}

export default class PostPuzzleCommand extends Command<Context> {
  type = "puzzle";
  description = "Posts the daily puzzle";
  args = [];

  canExecute(message: Message): boolean {
    return (
      message.command === this.type &&
      (message.channel.type === "GUILD_NEWS" ||
        message.channel.type === "GUILD_TEXT")
    );
  }

  async execute(message: Message): Promise<void> {
    await this.context.postDailyPuzzleInChannel(
      message.channel as NewsChannel | TextChannel
    );
  }
}
