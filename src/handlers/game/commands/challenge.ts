import { Chess } from "chess.ts";
import { ThreadChannel, User } from "discord.js";
import { getUser } from "../../../client";
import { Command } from "../../../commands";
import { Message } from "../../../messages";
import { isThreadChannel, Regex } from "../../../utils";
import { SIDES, SIDE_RANDOM, SIDE_WHITE, SIDE_BLACK } from "../sides";
import { GameInfo, GameStore, PlayerInfo, PlayersInfo } from "../types";

interface Context {
  games: GameStore;
  sendState: (thread: ThreadChannel, info: GameInfo) => Promise<void>;
}

function getPlayerInfo(user: User): PlayerInfo {
  return {
    id: user.id,
  };
}

function getPlayersForSideChoice(
  side: string,
  challenger: User,
  opponent: User
): PlayersInfo {
  const resolvedSide =
    side === SIDE_RANDOM
      ? Math.random() < 0.5
        ? SIDE_WHITE
        : SIDE_BLACK
      : side;
  return resolvedSide === SIDE_WHITE
    ? {
        white: getPlayerInfo(challenger),
        black: getPlayerInfo(opponent),
      }
    : {
        white: getPlayerInfo(opponent),
        black: getPlayerInfo(challenger),
      };
}

export default class ChallengeCommand extends Command<Context> {
  type = "challenge";
  description = "Start a chess game";
  args = [
    {
      name: "opponent",
      description: "Opponent to challenge",
    },
    {
      name: "side",
      description: "Side to play: `white`, `black`, or `random` (default)",
      optional: true,
    },
  ];

  canExecute(message: Message): boolean {
    return message.command === this.type && !isThreadChannel(message.channel);
  }

  async execute(message: Message) {
    if (message.args.length === 0) {
      return;
    }

    if (message.args.length > 1 && !SIDES.includes(message.args[1])) {
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
      players: getPlayersForSideChoice(
        message.args[1],
        message.author,
        targetUser
      ),
      currentTurn: SIDE_WHITE,
    };
    this.context.games[thread.id] = info;

    await this.context.sendState(thread, info);
  }
}
