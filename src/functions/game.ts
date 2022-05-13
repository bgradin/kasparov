import Discord from "discord.js";
import { Chess } from "chess.ts";
import client from "../client";
import { Command, DEFAULT_COMMAND_TYPE } from "../commands";
import Function from "./function";

const USER_MENTION_RX = /<@(\d+)>/;

interface GameStore {
  [key: string]: Chess;
}

const games: GameStore = {};

async function getUser(userId: string): Promise<Discord.User> {
  try {
    return await client.users.fetch(userId);
  } catch (err) {
    debugger;
  }
}

export default class GameFunction implements Function {
  canExecute(command: Command): boolean {
    if (
      command.type === "challenge" &&
      ["GUILD_TEXT", "GUILD_NEWS"].includes(command.message.channel.type)
    ) {
      return true;
    }

    if (
      command.type === DEFAULT_COMMAND_TYPE &&
      ["GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(
        command.message.channel.type
      )
    ) {
      return true;
    }

    return false;
  }

  async execute(command: Command) {
    if (
      ["GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(
        command.message.channel.type
      )
    ) {
      await this.handleMove(command);
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

    const game = new Chess();
    games[thread.id] = game;

    thread.send(`\`\`\`${game.ascii()}\`\`\``);
  }

  async handleMove(command: Command) {
    const game = games[command.message.channel.id];
    if (!game) {
      return;
    }

    const move = command.args[0].trim();
    const moves: string[] = game.moves();
    if (moves.includes(move)) {
      game.move(move);
      command.message.channel.send(`\`\`\`${game.ascii()}\`\`\``);
    } else {
      command.message.channel.send("Invalid move!");
    }
  }
}
