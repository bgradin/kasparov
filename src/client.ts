import {
  BitFieldResolvable,
  Client,
  IntentsString,
  Message,
  ThreadChannel,
  User,
} from "discord.js";
import { ChannelTypes } from "./utils";

const INTENTS: BitFieldResolvable<IntentsString, number> = [
  "GUILDS",
  "GUILD_MESSAGES",
];

export const client = new Client({ intents: INTENTS });

export async function getUser(userId: string): Promise<User> {
  try {
    return await client.users.fetch(userId);
  } catch (err) {
    console.error(err);
  }
}

export async function getThreadMessage(
  channelId: string,
  messageId: string
): Promise<Message> {
  const channel = await client.channels.fetch(channelId);
  if (ChannelTypes.THREAD.includes(channel.type)) {
    return await (channel as ThreadChannel).messages.fetch(messageId);
  }
}
