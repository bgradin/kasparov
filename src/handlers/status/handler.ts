import { Message, NewsChannel, TextChannel } from "discord.js";
import { Handler, HandlerInfo } from "../handler";
import { client } from "../../client";
import StatusCommand from "./commands/status";

async function postStatusInAllChannels(status: string) {
  const channels = await findPublicChessTextChannels();

  for (let i = 0; i < channels.length; i++) {
    await channels[i].send(status);
  }
}

async function findPublicChessTextChannels(): Promise<
  (NewsChannel | TextChannel)[]
> {
  const result: (NewsChannel | TextChannel)[] = [];

  const guilds = await client.guilds.fetch();
  for (let i = 0; i < guilds.size; i++) {
    const guild = guilds.at(i);
    if (!guild) {
      continue;
    }

    const channels = await (await guild.fetch()).channels.fetch();
    for (let j = 0; j < channels.size; j++) {
      const channel = channels.at(j);
      if (
        !channel ||
        !client.user ||
        channel.name.toLowerCase() !== "chess" ||
        (typeof channel.isTextBased === "function" && !channel.isTextBased())
      ) {
        continue;
      }

      const permissions = channel.permissionsFor(client.user);
      if (
        !permissions ||
        !permissions.has(1n << 11n) ||
        !permissions.has(1n << 10n)
      ) {
        continue;
      }

      result.push(channel as TextChannel);
    }
  }

  return result;
}

export default class StatusHandler extends Handler {
  getInfo(): HandlerInfo {
    return {
      commands: [
        new StatusCommand({
          postStatusInAllChannels,
        }),
      ],
    };
  }
}
