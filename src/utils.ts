import fs from "fs";
import http from "http";
import https from "https";
import {
  If,
  GuildTextBasedChannel,
  TextBasedChannel,
  ChannelType,
} from "discord.js";
import { promisify } from "util";
import { RequestOptions } from "http";

export const ChannelTypes = {
  GUILD: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  THREAD: [
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.AnnouncementThread,
  ],
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

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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

export async function request(
  url: string,
  options: RequestOptions = {},
  data: any = undefined
): Promise<string> {
  const lib = url.startsWith("https://") ? https : http;

  return new Promise((resolve, reject) => {
    const req = lib.request(url, options, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const body: Uint8Array[] = [];

      res.on("data", (chunk) => {
        body.push(chunk);
      });

      res.on("end", () => resolve(Buffer.concat(body).toString("utf8")));
    });

    req.on("error", reject);

    if (data) {
      req.write(data);
    }

    req.end();
  });
}
