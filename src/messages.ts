import Discord from "discord.js";
import { COMMAND_PREFIX } from "./commands";

export interface Message extends Discord.Message {
  command?: string;
  args: string[];
}

export function parse(message: Discord.Message): Message {
  const startsWithCommandPrefix = message.content.startsWith(COMMAND_PREFIX);
  const body = startsWithCommandPrefix
    ? message.content.slice(COMMAND_PREFIX.length)
    : message.content;
  const args = body.split(" ");
  const command = startsWithCommandPrefix
    ? args.shift().toLowerCase()
    : undefined;
  return Object.assign(message, {
    command,
    args,
  });
}
