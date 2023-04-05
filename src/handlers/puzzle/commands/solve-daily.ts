import { Chess } from "chess.ts";
import { Command } from "../../../commands";
import { Message } from "../../../messages";
import { LichessDailyPuzzle } from "../types";

const SPOILER_FORMATTING_REGEX = /\|\|/g;

interface Context {
  getDailyPuzzle: () => Promise<LichessDailyPuzzle>;
}

export default class SolveDailyPuzzleCommand extends Command<Context> {
  type = "solve";
  description = "Solves a puzzle";
  args = [
    {
      name: "solution",
      description: `Propose solution for the current daily puzzle.
Note: Spoiler formatting (||) will be stripped from this parameter, allowing solutions to be discreet.`,
    },
  ];

  canExecute(message: Message): boolean {
    return message.command === this.type;
  }

  async execute(message: Message) {
    const solution = message.args
      .join(" ")
      .replace(SPOILER_FORMATTING_REGEX, "")
      .split(/\s+/);
    const hasSpoilerRegex = SPOILER_FORMATTING_REGEX.test(
      message.args.join(" ")
    );
    const puzzle = await this.context.getDailyPuzzle();
    const chessFullsolution = new Chess();
    chessFullsolution.loadPgn(puzzle.game.pgn);
    const startingMovesPlayed = chessFullsolution.history().length;
    const solvingPlayer = chessFullsolution.turn();

    const chessPartialSolution = new Chess(chessFullsolution.fen());
    const chessSolution = new Chess(chessFullsolution.fen());

    for (let i = 0; i < puzzle.puzzle.solution.length; i++) {
      chessFullsolution.move(puzzle.puzzle.solution[i], { sloppy: true });

      if (i < solution.length) {
        chessPartialSolution.move(puzzle.puzzle.solution[i], { sloppy: true });
      }
    }

    let validSequence = true;
    for (let i = 0; i < solution.length; i++) {
      validSequence =
        validSequence && !!chessSolution.move(solution[i], { sloppy: true });
    }

    if (!validSequence) {
      await message.react("❌");
      await message.reply("Invalid sequence of moves!");
    } else if (chessFullsolution.fen() === chessSolution.fen()) {
      await message.react("✅");
      await message.reply(`<@${message.author.id}> got the correct solution!`);
    } else if (chessPartialSolution.fen() === chessSolution.fen()) {
      await message.react("👍");

      if (chessPartialSolution.turn() !== solvingPlayer) {
        await message.reply(
          `Good so far. ${solvingPlayer === "w" ? "Black" : "White"} plays ${
            hasSpoilerRegex ? "|" : ""
          }${
            chessFullsolution.history()[startingMovesPlayed + solution.length]
          }${hasSpoilerRegex ? "|" : ""}`
        );
      } else {
        await message.reply("Good so far...keep going!");
      }
    } else {
      await message.react("❌");
    }
  }
}
