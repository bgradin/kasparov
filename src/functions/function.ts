import { InteractionType } from "discord-interactions";
import { Command } from "../commands";

export default abstract class Function {
  abstract getCommands(): Command[];
  abstract canHandle(type: InteractionType, data: any): boolean;
  abstract handle(type: InteractionType, data: any);
}
