import { ThreadChannel } from "discord.js";
import ChessImageGenerator from "chess-image-generator";
import { Handler, HandlerInfo } from "../handler";
import { GameInfo, GameStore } from "./types";
import ChallengeCommand from "./commands/challenge";
import MoveCommand from "./commands/move";
import MovesCommand from "./commands/moves";
import { opposite } from "./sides";
import { load, save } from "./data";

const imageGenerator = new ChessImageGenerator();

export default class GameHandler extends Handler {
  games: GameStore;

  async initialize() {
    this.games = await load();
  }

  getInfo(): HandlerInfo {
    return {
      commands: [
        new ChallengeCommand({
          games: this.games,
          sendState: this.sendState.bind(this),
        }),

        new MoveCommand({
          games: this.games,
          sendState: this.sendState.bind(this),
        }),

        new MovesCommand({
          games: this.games,
        }),
      ],
    };
  }

  remove(info: GameInfo) {
    Object.keys(this.games).forEach((key) => {
      if (this.games[key] === info) {
        delete this.games[key];
      }
    });
  }

  getStateCaption(info: GameInfo) {
    if (info.chess.inCheckmate()) {
      const winningSide = opposite(info.currentTurn);
      this.remove(info);
      return `<@${info.players[winningSide].id}> (${winningSide}) wins by checkmate!`;
    } else if (info.chess.inThreefoldRepetition()) {
      this.remove(info);
      return "Drawn by repetition!";
    } else if (info.chess.inStalemate()) {
      this.remove(info);
      return "Drawn by stalemate!";
    } else if (info.chess.insufficientMaterial()) {
      this.remove(info);
      return "Drawn due to insufficient material!";
    } else if (info.chess.inDraw()) {
      this.remove(info);
      return "Drawn by 50-move rule!";
    }

    const currentPlayer = info.players[info.currentTurn];
    return `<@${currentPlayer.id}> (${info.currentTurn}) to play`;
  }

  async sendState(channel: ThreadChannel, info: GameInfo) {
    imageGenerator.loadFEN(info.chess.fen());
    const png = await imageGenerator.generateBuffer();

    const payload = {
      content: this.getStateCaption(info),
      files: [
        {
          attachment: png,
        },
      ],
    };

    if (info.previousMessage) {
      await info.previousMessage.delete();
      info;
    }

    info.previousMessage = await channel.send(payload);

    save(info);
  }
}
