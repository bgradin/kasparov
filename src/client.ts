import Discord, { BitFieldResolvable, IntentsString } from "discord.js";

const INTENTS: BitFieldResolvable<IntentsString, number> = [
  "GUILDS",
  "GUILD_MESSAGES",
];

export const client = new Discord.Client({ intents: INTENTS });

export async function getUser(userId: string): Promise<Discord.User> {
  try {
    return await client.users.fetch(userId);
  } catch (err) {
    debugger;
  }
}
