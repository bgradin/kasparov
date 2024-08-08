import GameHandler from "./handlers/game/handler";
import HelpHandler from "./handlers/help";
import PuzzleHandler from "./handlers/puzzle/handler";
import RulesHandler from "./handlers/rules";
import StatusHandler from "./handlers/status/handler";

export const Handlers = {
  ALL: [
    new GameHandler(),
    new PuzzleHandler(),
    new HelpHandler(),
    new RulesHandler(),
    new StatusHandler(),
  ],
};
