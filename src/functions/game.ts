import { InteractionType } from "discord-interactions";
import { Command } from "../commands";
import Function from "./function";

export default class GameFunction implements Function {
  getCommands(): Command[] {
    return [];
  }

  canHandle(type: InteractionType, data: any): boolean {
    debugger;
    return true;
  }

  handle(type: InteractionType, data: any) {
    debugger;
  }
}
