import Discord, { BitFieldResolvable, IntentsString } from "discord.js";

const INTENTS: BitFieldResolvable<IntentsString, number> = [
  "GUILDS",
  "GUILD_MESSAGES",
];

const client = new Discord.Client({ intents: INTENTS });

export default client;
