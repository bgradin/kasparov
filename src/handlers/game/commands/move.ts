import { ThreadChannel } from "discord.js";
import { Command } from "../../../commands";
import { Message } from "../../../messages";
import { isThreadChannel } from "../../../utils";
import { GameInfo, GameStore } from "../types";

interface Context {
  games: GameStore;
  sendState: (thread: ThreadChannel, info: GameInfo) => Promise<void>;
}

export default class MoveCommand extends Command<Context> {
  type = "move";
  description = "Moves a piece in a game";
  args = [];

  canExecute(message: Message): boolean {
    return (
      isThreadChannel(message.channel) &&
      (!message.command || message.command === this.type)
    );
  }

  async execute(message: Message) {
    if (message.args.length < 1) {
      return;
    }

    const info = this.context.games[message.channel.id];
    if (!info) {
      return;
    }

    const move = message.args[0].trim();
    const moves: string[] = info.chess.moves();
    if (moves.includes(move)) {
      info.chess.move(move);

      await this.context.sendState(message.channel as ThreadChannel, info);
    } else {
      message.channel.send('Invalid move! If you get stuck, try "!moves"');
    }
  }
}
