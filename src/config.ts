import GameHandler from "./handlers/game/handler";
import HelpHandler from "./handlers/help";

export const Handlers = {
  ALL: [new GameHandler(), new HelpHandler()],
};
