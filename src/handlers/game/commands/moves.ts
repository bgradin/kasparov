import { Command } from "../../../commands";
import { Message } from "../../../messages";
import { isThreadChannel } from "../../../utils";
import { GameStore } from "../types";

interface Context {
  games: GameStore;
}

export default class MovesCommand extends Command<Context> {
  type = "moves";
  description = "Prints all valid moves in the current position";
  args = [];

  canExecute(message: Message): boolean {
    return isThreadChannel(message.channel) && message.command === this.type;
  }

  async execute(message: Message) {
    if (!this.context) {
      return;
    }

    const info = this.context.games[message.channel.id];
    if (!info) {
      return;
    }

    message.channel.send(info.chess.moves().join(", "));
  }
}
