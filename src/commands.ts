import Discord from "discord.js";

export const COMMAND_PREFIX = "!";
export const DEFAULT_COMMAND_TYPE = "simple";

export interface Command {
  type: string;
  args: string[];
  message: Discord.Message;
}

export function getCommand(message: Discord.Message): Command {
  const startsWithCommandPrefix = message.content.startsWith(COMMAND_PREFIX);
  const body = startsWithCommandPrefix
    ? message.content.slice(COMMAND_PREFIX.length)
    : message.content;
  const args = body.split(" ");
  const type = startsWithCommandPrefix
    ? args.shift().toLowerCase()
    : DEFAULT_COMMAND_TYPE;
  return {
    type,
    args,
    message,
  };
}
