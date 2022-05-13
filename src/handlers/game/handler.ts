import { ThreadChannel } from "discord.js";
import ChessImageGenerator from "chess-image-generator";
import { Handler, HandlerInfo } from "../handler";
import { GameInfo, GameStore } from "./types";
import ChallengeCommand from "./commands/challenge";
import MoveCommand from "./commands/move";
import MovesCommand from "./commands/moves";

const games: GameStore = {};
const imageGenerator = new ChessImageGenerator();

async function sendState(channel: ThreadChannel, info: GameInfo) {
  imageGenerator.loadFEN(info.chess.fen());
  const png = await imageGenerator.generateBuffer();

  const payload = {
    files: [
      {
        attachment: png,
      },
    ],
  };

  if (info.previousMessage) {
    await info.previousMessage.delete();
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
