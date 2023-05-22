import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
  Message,
  ThreadChannel,
  User,
} from "discord.js";
import { ChannelTypes } from "./utils";

const INTENTS: BitFieldResolvable<GatewayIntentsString, number> = [
  "Guilds",
  "GuildMessages",
];

export const client = new Client({ intents: INTENTS });

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    return await client.users.fetch(userId);
  } catch (err) {
    console.error(err);
  }
}

export async function getThreadMessage(
  channelId: string,
  messageId: string
): Promise<Message | undefined> {
  const channel = await client.channels.fetch(channelId);
  if (channel && ChannelTypes.THREAD.includes(channel.type)) {
    return await (channel as ThreadChannel).messages.fetch(messageId);
  }
}
