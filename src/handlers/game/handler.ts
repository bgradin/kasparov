import { ThreadChannel } from "discord.js";
import ChessImageGenerator from "chess-image-generator";
import { Handler, HandlerInfo } from "../handler";
import { GameInfo, GameStore } from "./types";
import ChallengeCommand from "./commands/challenge";
import MoveCommand from "./commands/move";
import MovesCommand from "./commands/moves";
import { opposite } from "./sides";

const games: GameStore = {};
const imageGenerator = new ChessImageGenerator();

function remove(info: GameInfo) {
  Object.keys(games).forEach((key) => {
    if (games[key] === info) {
      delete games[key];
    }
  });
}

function getStateCaption(info: GameInfo) {
  if (info.chess.inCheckmate()) {
    const winningSide = opposite(info.currentTurn);
    remove(info);
    return `<@${info.players[winningSide].id}> (${winningSide}) wins by checkmate!`;
  } else if (info.chess.inThreefoldRepetition()) {
    remove(info);
    return "Drawn by repetition!";
  } else if (info.chess.inStalemate()) {
    remove(info);
    return "Drawn by stalemate!";
  } else if (info.chess.insufficientMaterial()) {
    remove(info);
    return "Drawn due to insufficient material!";
  } else if (info.chess.inDraw()) {
    remove(info);
    return "Drawn by 50-move rule!";
  }

  const currentPlayer = info.players[info.currentTurn];
  return `<@${currentPlayer.id}> (${info.currentTurn}) to play`;
}

async function sendState(channel: ThreadChannel, info: GameInfo) {
  imageGenerator.loadFEN(info.chess.fen());
  const png = await imageGenerator.generateBuffer();

  const payload = {
    content: getStateCaption(info),
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
}

export default class GameHandler extends Handler {
  getInfo(): HandlerInfo {
    return {
      commands: [
        new ChallengeCommand({
          games,
          sendState,
        }),

        new MoveCommand({
          games,
          sendState,
        }),

        new MovesCommand({
          games,
        }),
      ],
    };
  }
}
