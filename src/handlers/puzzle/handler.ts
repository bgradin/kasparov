import { Chess } from "chess.ts";
import ChessImageGenerator from "chess-image-generator";
import { CronJob } from "cron";
import { MessageOptions, NewsChannel, TextChannel } from "discord.js";
import { request } from "../../utils";
import { Handler, HandlerInfo } from "../handler";
import { client } from "../../client";
import PostDailyPuzzleCommand from "./commands/post-daily";
import SolveDailyPuzzleCommand from "./commands/solve-daily";
import { LichessDailyPuzzle, LichessPlayerInfo } from "./types";

const LICHESS_PUZZLE_API_ENDPOINT = "https://lichess.org/api/puzzle/daily";

const chessImageGenerator = new ChessImageGenerator();

async function getDailyPuzzle(): Promise<LichessDailyPuzzle> {
  const response = await request(LICHESS_PUZZLE_API_ENDPOINT);
  const json = JSON.parse(response);
  if (
    // TODO: Move validation to JSON schema and generate interfaces
    typeof json.game === "object" &&
    typeof json.puzzle === "object" &&
    typeof json.game.pgn === "string" &&
    Array.isArray(json.game.players) &&
    json.game.players.every((player) => typeof player.name === "string") &&
    Array.isArray(json.puzzle.solution)
  ) {
    return json;
  }
}

async function findPublicChessTextChannels(): Promise<
  (NewsChannel | TextChannel)[]
> {
  const result: (NewsChannel | TextChannel)[] = [];

  const guilds = await client.guilds.fetch();
  for (let i = 0; i < guilds.size; i++) {
    const guild = await guilds.at(i).fetch();
    const channels = await guild.channels.fetch();
    for (let j = 0; j < channels.size; j++) {
      const channel = channels.at(j);
      if (channel.name.toLowerCase() !== "chess" || !channel.isText()) {
        continue;
      }

      const permissions = channel.permissionsFor(client.user);
      if (
        !permissions.has("SEND_MESSAGES") ||
        !permissions.has("VIEW_CHANNEL")
      ) {
        continue;
      }

      result.push(channel);
    }
  }

  return result;
}

function formatPlayer(player: LichessPlayerInfo): string {
  return `${player.title ? player.title + " " : ""}${player.name}`;
}

async function formatPuzzleAsDiscordMessage(
  puzzle: LichessDailyPuzzle
): Promise<MessageOptions> {
  const chess = new Chess();
  chess.loadPgn(puzzle.game.pgn);

  chessImageGenerator.loadFEN(chess.fen());
  const png = await chessImageGenerator.generateBuffer();

  return {
    files: [
      {
        attachment: png,
      },
    ],
    embeds: [
      {
        title: `Puzzle of the day — ${
          chess.turn() === "w" ? "white" : "black"
        } to play`,
        description: `Taken from ${formatPlayer(
          puzzle.game.players[0]
        )} vs ${formatPlayer(
          puzzle.game.players[1]
        )}\n\n[View on Lichess.org](https://lichess.org/training/${
          puzzle.puzzle.id
        })`,
      },
    ],
  };
}

async function getDailyPuzzleMessage(): Promise<MessageOptions> {
  const puzzle = await getDailyPuzzle();
  return await formatPuzzleAsDiscordMessage(puzzle);
}

async function postDailyPuzzleInChannel(channel: NewsChannel | TextChannel) {
  await channel.send(await getDailyPuzzleMessage());
}

async function postDailyPuzzleInAllChannels() {
  const message = await getDailyPuzzleMessage();

  const channels = await findPublicChessTextChannels();
  for (let i = 0; i < channels.length; i++) {
    channels[i].send(message);
  }
}

export default class PuzzleHandler extends Handler {
  _cron = new CronJob(
    "0 0 8 * * *",
    postDailyPuzzleInAllChannels,
    null,
    true,
    "America/Los_Angeles"
  );

  getInfo(): HandlerInfo {
    return {
      commands: [
        new PostDailyPuzzleCommand({
          postDailyPuzzleInChannel,
        }),
        new SolveDailyPuzzleCommand({}),
      ],
    };
  }
}
