import { ChannelType, NewsChannel, TextChannel } from "discord.js";
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
      (message.channel.type === ChannelType.GuildAnnouncement ||
        message.channel.type === ChannelType.GuildText)
    );
  }

  async execute(message: Message): Promise<void> {
    if (!this.context) {
      return;
    }

    await this.context.postDailyPuzzleInChannel(
      message.channel as NewsChannel | TextChannel
    );
  }
}
