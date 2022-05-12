import express, { Request, Response } from "express";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import Function from "./functions/function";
import { verifyDiscordRequest } from "./utils";
import { installCommands } from "./commands";

const PORT = process.env.PORT || 8080;

export default class Server {
  private _server = express();
  private _functions: Function[] = [];

  constructor() {
    this._server.use(
      express.json({
        verify: verifyDiscordRequest(process.env.PUBLIC_KEY),
      })
    );
    this._server.get("/", (req, res) => {
      return res.send("OK");
    });
    this._server.post("/interactions", this.handleInteraction.bind(this));
  }

  handleInteraction(req: Request, res: Response) {
    const { type, id, data } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    const func = this._functions.find((x) => x.canHandle(type, data));
    if (func) {
      res.send(func.handle(type, data));
    } else {
      res.status(400).send();
    }
  }

  async register(func: Function) {
    await installCommands(
      process.env.APP_ID,
      process.env.GUILD_ID,
      func.getCommands()
    );

    this._functions.push(func);
  }

  start() {
    this._server.listen(PORT);
  }
}
