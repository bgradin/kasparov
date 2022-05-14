import fs from "fs";
import { If, GuildTextBasedChannel, TextBasedChannel } from "discord.js";
import { promisify } from "util";

export const ChannelTypes = {
  GUILD: ["GUILD_TEXT", "GUILD_NEWS"],
  THREAD: ["GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD", "GUILD_NEWS_THREAD"],
};

export const Regex = {
  USER_MENTION: /<@(\d+)>/,
};

export function isGuildChannel<Cached extends boolean = boolean>(
  channel: If<Cached, GuildTextBasedChannel, TextBasedChannel>
): boolean {
  return ChannelTypes.GUILD.includes(channel.type);
}

export function isThreadChannel<Cached extends boolean = boolean>(
  channel: If<Cached, GuildTextBasedChannel, TextBasedChannel>
): boolean {
  return ChannelTypes.THREAD.includes(channel.type);
}

export function alphabeticallyBy<T>(
  keyFn: (obj: T) => string
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);
    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
  };
}

export const readdir = promisify(fs.readdir);
export const readfile = promisify(fs.readFile);
export const rm = promisify(fs.rm);
export const writefile = promisify(fs.writeFile);
export const appendfile = promisify(fs.appendFile);
