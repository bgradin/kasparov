import { Message } from "./messages";

export const COMMAND_PREFIX = "!";

export interface CommandArg {
  name: string;
  description: string;
}

export abstract class Command<T extends {} = {}> {
  abstract type: string;
  abstract args: CommandArg[];
  abstract description: string;

  context?: T;

  constructor(context: T) {
    this.context = context;
  }

  abstract canExecute(message: Message): boolean;
  abstract execute(message: Message): Promise<void>;
}
