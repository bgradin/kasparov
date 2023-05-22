import { Command } from "../commands";
import { Message } from "../messages";

export interface HandlerInfo {
  commands: Command[];
}

export abstract class Handler {
  async initialize() {} // Virtual

  findCommand(message: Message): Command | undefined {
    return this.getInfo().commands.find((command) =>
      command.canExecute(message)
    );
  }

  abstract getInfo(): HandlerInfo;
}
