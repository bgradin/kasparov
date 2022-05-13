import { Chess } from "chess.ts";
import { Message } from "discord.js";

export interface GameInfo {
  chess: Chess;
  previousMessage?: Message;
}

export interface GameStore {
  [key: string]: GameInfo;
}
