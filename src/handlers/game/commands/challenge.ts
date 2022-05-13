import { Chess } from "chess.ts";
import { ThreadChannel } from "discord.js";
import { getUser } from "../../../client";
import { Command } from "../../../commands";
import { Message } from "../../../messages";
import { isThreadChannel, Regex } from "../../../utils";
import { GameInfo, GameStore } from "../types";

interface Context {
  games: GameStore;
  sendState: (thread: ThreadChannel, info: GameInfo) => Promise<void>;
}

export default class ChallengeCommand extends Command<Context> {
  type = "challenge";
  description = "Start a chess game";
  args = [
    {
      name: "opponent",
      description: "Opponent to challenge",
    },
  ];

  canExecute(message: Message): boolean {
    return message.command === this.type && !isThreadChannel(message.channel);
  }

  async execute(message: Message) {
    if (message.args.length === 0) {
      return;
    }

    const targetUserRx = message.args[0].match(Regex.USER_MENTION);
    if (targetUserRx.length < 2) {
      return;
    }

    const targetUser = await getUser(targetUserRx[1]);
    if (!targetUser) {
      return;
    }

    const thread = await message.startThread({
      name: `${message.author.username} vs ${targetUser.username}`,
    });

    const info: GameInfo = {
      chess: new Chess(),
    };
    this.context.games[thread.id] = info;

    await this.context.sendState(thread, info);
  }
}
