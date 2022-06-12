import { Command } from "../commands";
import { Message } from "../messages";
import { Handler, HandlerInfo } from "./handler";

const TERMS_TEXT = `
- Promotion: Pawns which get to the end of the board become a different piece, chosen by the current player, with the exception of pawn or king.
- Rank: Another word for row
- File: Another word for column`;

const MOVEMENT_TEXT = `
- King: 1 square in any direction
- Queen: Any number of squares in any direction
- Rook: Any number of squares up, down, left right
- Bishop: Any number of squares diagonally
- Knight: Most complicated one. It moves to a square of the opposite color two squares away. Some people describe it as an L shape. So up two and over one or over two and up one.
- Pawns: Can only move forward, but can only capture diagonally.
- En passant: If pawn A is three squares away from promotion, and enemy pawn B a) is in an adjacent file b) was previously on its starting square and c) just moved past pawn A, pawn A can capture pawn B.
- Castling: The king can swap places with a rook once per game. More specifically, the king moves two squares toward the rook, and the rook moves to the other side of the King (directly adjacent) compared to the side it was previously.`;

const NOTATION_TEXT = `
Each square on the chess board has a unique identifier. Rows are denoted by numbers 1-8, starting on the white side of the board. Columns are denoted by letters A-H, starting on white's left side. In algebraic chess notation, a move is represented in the format <piece code><takes?><square><suffix>. Piece codes: King=K, Queen=Q, Rook=R, Bishop=B, Knight=N, Pawn=none, unless it is capturing, in which case you use a lowercase letter of the file the pawn is in. If a capture is taking place, <takes?> is replaced with "x". Suffixes: Check=+, Checkmate=#.`;

class RulesCommand extends Command {
  type = "rules";
  description = "Displays rules of chess";
  args: [];

  async execute(message: Message) {
    message.channel.send({
      embeds: [
        {
          title: `Rules of Chess`,
          description: "For more, see [Wikipedia](https://en.wikipedia.org/wiki/Rules_of_chess)",
          fields: [
            {
              name: "Terms",
              value: TERMS_TEXT,
            },
            {
              name: "Movement",
              value: MOVEMENT_TEXT
            },
            {
              name: "Notation",
              value: NOTATION_TEXT,
            }
          ],
        },
      ],
    });
  }
}

export default class HelpHandler extends Handler {
  getInfo(): HandlerInfo {
    return { commands: [new RulesCommand({})] };
  }
}
