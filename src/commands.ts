import { Message } from "./messages";

export const COMMAND_PREFIX = "!!";

export interface CommandArg {
  name: string;
  description: string;
  optional?: boolean;
}

export abstract class Command<T extends {} = {}> {
  abstract type: string;
  abstract args: CommandArg[];
  abstract description: string;

  context?: T;

  constructor(context: T) {
    this.context = context;
  }

  canExecute(message: Message): boolean {
    return message.command === this.type;
  }

  abstract execute(message: Message): Promise<void>;
}
