export interface LichessPlayerInfo {
  userId: string;
  name: string;
  color: string;
  title?: string;
}

export interface LichessDailyPuzzleGame {
  id: string;
  rated: boolean;
  players: LichessPlayerInfo[];
  pgn: string;
}

export type LichessPuzzleSolution = string[];

export type LichessPuzzleThemes = string[];

export interface LichessDailyPuzzleMetadata {
  id: string;
  rating: number;
  solution: LichessPuzzleSolution;
  themes: LichessPuzzleThemes;
}

export interface LichessDailyPuzzle {
  game: LichessDailyPuzzleGame;
  puzzle: LichessDailyPuzzleMetadata;
}
