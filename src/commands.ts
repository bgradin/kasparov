import { makeDiscordRequest } from "./utils";

export interface CommandOptionChoice {
  name: string;
  value: string;
}

export interface CommandOption {
  name: string;
  description: string;
  type: number;
  choices: CommandOptionChoice[];
}

export interface Command {
  name: string;
  description: string;
  type: number;
  options?: CommandOption[];
}

async function installCommand(
  appId: string,
  guildId: string,
  command: Command
) {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    await makeDiscordRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(command),
    });
  } catch (err) {
    console.error(err);
  }
}

async function installCommandIfNecessary(
  appId: string,
  guildId: string,
  command: Command
) {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await makeDiscordRequest(endpoint, { method: "GET" });
    const data = (await res.json()) as Command[];

    if (data) {
      const installedNames = data.map((c) => c.name);
      if (!installedNames.includes(command.name)) {
        await installCommand(appId, guildId, command);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function installCommands(
  appId: string,
  guildId: string,
  commands: Command[]
) {
  if (!appId || !guildId || appId === "" || guildId === "") {
    return;
  }

  for (let i = 0; i < commands.length; i++) {
    await installCommandIfNecessary(appId, guildId, commands[i]);
  }
}
