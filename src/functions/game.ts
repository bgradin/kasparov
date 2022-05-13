import Discord, { ThreadChannel } from "discord.js";
import { Chess } from "chess.ts";
import ChessImageGenerator from "chess-image-generator";
import client from "../client";
import { Command, DEFAULT_COMMAND_TYPE } from "../commands";
import Function from "./function";

const USER_MENTION_RX = /<@(\d+)>/;

const Commands = {
  CHALLENGE: "challenge",
  MOVES: "moves",
};

interface GameInfo {
  chess: Chess;
  previousMessage?: Discord.Message;
}

interface GameStore {
  [key: string]: GameInfo;
}

const games: GameStore = {};
const imageGenerator = new ChessImageGenerator();

async function sendGameState(channel: Discord.ThreadChannel, info: GameInfo) {
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

async function getUser(userId: string): Promise<Discord.User> {
  try {
    return await client.users.fetch(userId);
  } catch (err) {
    debugger;
  }
}

export default class GameFunction implements Function {
  canExecute(command: Command): boolean {
    // Valid guild commands
    if (
      command.type === Commands.CHALLENGE &&
      ["GUILD_TEXT", "GUILD_NEWS"].includes(command.message.channel.type)
    ) {
      return true;
    }

    // Valid thread commands
    if (
      ["GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(
        command.message.channel.type
      )
    ) {
      if (command.type === DEFAULT_COMMAND_TYPE) {
        return true;
      }

      if (command.type === Commands.MOVES) {
        return true;
      }
    }

    return false;
  }

  async execute(command: Command) {
    if (
      ["GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(
        command.message.channel.type
      )
    ) {
      if (command.type === DEFAULT_COMMAND_TYPE) {
        await this.handleMove(command);
      } else if (command.type === Commands.MOVES) {
        await this.printMoves(command);
      }
    } else {
      await this.startNewGame(command);
    }
  }

  async startNewGame(command: Command) {
    const targetUserRx = command.args[0].match(USER_MENTION_RX);
    if (targetUserRx.length < 2) {
      return;
    }

    const targetUser = await getUser(targetUserRx[1]);
    if (!targetUser) {
      return;
    }

    const thread = await command.message.startThread({
      name: `${command.message.author.username} vs ${targetUser.username}`,
    });

    const info: GameInfo = {
      chess: new Chess(),
    };
    games[thread.id] = info;

    await sendGameState(thread, info);
  }

  async handleMove(command: Command) {
    const info = games[command.message.channel.id];
    if (!info) {
      return;
    }

    const move = command.args[0].trim();
    const moves: string[] = info.chess.moves();
    if (moves.includes(move)) {
      info.chess.move(move);

      await sendGameState(command.message.channel as ThreadChannel, info);
    } else {
      command.message.channel.send(
        'Invalid move! If you get stuck, try "!moves"'
      );
    }
  }

  async printMoves(command: Command) {
    const info = games[command.message.channel.id];
    if (!info) {
      return;
    }

    command.message.channel.send(info.chess.moves().join(", "));
  }
}
