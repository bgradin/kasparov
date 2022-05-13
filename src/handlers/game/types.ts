import { Chess } from "chess.ts";
import { Message } from "discord.js";
import { Side } from "./sides";

export interface PlayerInfo {
  id: string;
}

export interface PlayersInfo {
  white: PlayerInfo;
  black: PlayerInfo;
}

export interface GameSaveState {
  fen: string;
  players: PlayersInfo;
  currentTurn: Side;
  channelId: string;
  previousMessageId: string;
}

export interface GameInfo {
  chess: Chess;
  previousMessage?: Message;
  players: PlayersInfo;
  currentTurn: Side;
  filePath?: string;
}

export interface GameStore {
  [key: string]: GameInfo;
}
