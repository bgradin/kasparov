import { ThreadChannel } from "discord.js";
import { Command, COMMAND_PREFIX } from "../../../commands";
import { Message } from "../../../messages";
import { isThreadChannel } from "../../../utils";
import { save } from "../data";
import { opposite, Side } from "../sides";
import { GameInfo, GameStore, PlayerInfo } from "../types";

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
    if (move.toLowerCase() === "resign") {
      info.players[info.currentTurn].resigned = true;

      await this.context.sendState(message.channel as ThreadChannel, info);
    } else if (move.toLowerCase() === "draw") {
      const authorSide = Object.keys(info.players).find(
        (key) => info.players[key as Side].id === message.author.id
      ) as Side;
      const author = info.players[authorSide];
      const opponent = info.players[opposite(authorSide)];

      author.draw = true;

      if (!opponent.draw) {
        await this.context.sendState(message.channel as ThreadChannel, info);

        await message.channel.send(
          `<@${author.id}> offers draw. Type "draw" to accept.`
        );
        await save(info);
      } else {
        await this.context.sendState(message.channel as ThreadChannel, info);
      }
    } else if (message.author.id === info.players[info.currentTurn].id) {
      const moves: string[] = info.chess.moves();

      if (moves.includes(move)) {
        info.chess.move(move);

        info.currentTurn = opposite(info.currentTurn);

        await this.context.sendState(message.channel as ThreadChannel, info);
      } else {
        await message.channel.send(
          `Invalid move! If you get stuck, try "${COMMAND_PREFIX}moves"`
        );
      }
    }
  }
}
