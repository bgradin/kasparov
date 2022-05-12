import Discord from "discord.js";
import client from "./client";
import Function from "./functions/function";
import { COMMAND_PREFIX, getCommand } from "./commands";

export default class Server {
  private _functions: Function[] = [];
  private _guilds: Discord.Guild[];

  constructor() {
    client.on("guildCreate", (guild) => {
      this._guilds.push(guild);
    });

    client.on("messageCreate", (message) => {
      if (message.author.bot) {
        return;
      }

      const command = getCommand(message);
      const func = this._functions.find((x) => x.canExecute(command));
      if (func) {
        func.execute(command);
      }
    });
  }

  async register(func: Function) {
    this._functions.push(func);
  }

  async start() {
    await client.login(process.env.BOT_TOKEN);

    const guilds = await client.guilds.fetch();
    this._guilds = [];
    for (let i = 0; i < guilds.size; i++) {
      this._guilds.push(await guilds.at(i).fetch());
    }
  }
}
