import { Command } from "../commands";

export default abstract class Function {
  abstract canExecute(command: Command): boolean;
  abstract execute(command: Command);
}
