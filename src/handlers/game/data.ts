import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { GameInfo, GameSaveState, GameStore } from "./types";
import { Chess } from "chess.ts";
import { getThreadMessage } from "../../client";

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
fs.mkdirSync(DATA_DIRECTORY, { recursive: true });

function getUniqueFilePath() {
  return path.join(DATA_DIRECTORY, nanoid()) + ".json";
}

export async function save(info: GameInfo) {
  return new Promise((resolve) => {
    if (!info.previousMessage) {
      throw new Error("Cannot save game info without channel info.");
    }

    const saveState = {
      fen: info.chess.fen(),
      players: info.players,
      currentTurn: info.currentTurn,
      channelId: info.previousMessage.channel.id,
      previousMessageId: info.previousMessage.id,
    };

    info.filePath = info.filePath || getUniqueFilePath();

    fs.writeFile(info.filePath, JSON.stringify(saveState), {}, resolve);
  });
}

async function readdir(directory: string): Promise<string[] | Buffer[]> {
  return new Promise((resolve) => {
    fs.readdir(directory, {}, (err, files) => {
      resolve(files);
    });
  });
}

async function readFile(path: string): Promise<Buffer> {
  return new Promise((resolve) => {
    fs.readFile(path, {}, (err, data) => {
      resolve(data);
    });
  });
}

export async function load(): Promise<GameStore> {
  const games: GameStore = {};
  const files = await readdir(DATA_DIRECTORY);
  for (let i = 0; i < files.length; i++) {
    if (typeof files[i] === "string") {
      const filePath = path.join(DATA_DIRECTORY, files[i] as string);
      const buffer = await readFile(filePath);
      if (!buffer) {
        console.error(`Could not load ${filePath}`);
        continue;
      }

      const saveState = JSON.parse(buffer.toString("utf8")) as GameSaveState;

      const chess = new Chess();
      chess.load(saveState.fen);

      let previousMessage;
      try {
        previousMessage = await getThreadMessage(
          saveState.channelId,
          saveState.previousMessageId
        );
      } catch (err) {
        console.log(
          `Could not load thread or message for ${filePath}. Deleting...`
        );
        fs.rmSync(filePath);
        continue;
      }

      const info: GameInfo = {
        chess: chess,
        players: saveState.players,
        currentTurn: saveState.currentTurn,
        previousMessage,
        filePath: filePath,
      };

      games[saveState.channelId] = info;
    }
  }

  return games;
}
