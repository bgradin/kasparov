import { Guild } from "discord.js";
import { client } from "./client";
import { Handler } from "./handlers/handler";
import { parse } from "./messages";

export default class Server {
  private _handlers: Handler[] = [];
  private _guilds: Guild[];

  constructor() {
    client.on("guildCreate", (guild) => {
      this._guilds.push(guild);
    });

    client.on("messageCreate", (message) => {
      if (message.author.bot) {
        return;
      }

      const parsedMessage = parse(message);
      const command = this._handlers
        .map((x) => x.findCommand(parsedMessage))
        .find((x) => !!x);
      if (command) {
        command.execute(parsedMessage);
      }
    });
  }

  async register(handler: Handler) {
    await handler.initialize();
    this._handlers.push(handler);
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
