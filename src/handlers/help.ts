import { Command, COMMAND_PREFIX } from "../commands";
import { Message } from "../messages";
import { Handler, HandlerInfo } from "./handler";
import { Handlers } from "../config";
import { alphabeticallyBy } from "../utils";

function print(command: Command, message: Message) {
  message.channel.send({
    embeds: [
      {
        title: `Help Command: ${command.type}`,
        description: `${command.description}\n\nSyntax: ${COMMAND_PREFIX}${
          command.type
        } ${command.args.map((arg) => `<${arg.name}>`).join(" ")}`,
        fields: command.args.map((arg) => ({
          name: arg.name,
          value: arg.description,
        })),
      },
    ],
  });
}

function printAll(commands: Command[], message: Message) {
  message.channel.send({
    embeds: [
      {
        title: `Help Command`,
        description:
          "Available commands:\n" +
          commands.map((command) => `\`${command.type}\``).join(", "),
        footer: {
          text: `Type "${COMMAND_PREFIX}help <command>" for details on a command`,
        },
      },
    ],
  });
}

class HelpCommand extends Command {
  type = "help";
  description = "Displays help for commands";
  args = [
    {
      name: "command",
      description: "Specific command for which to display help",
    },
  ];

  canExecute(message: Message): boolean {
    return message.command === this.type;
  }

  async execute(message: Message) {
    const commands = Handlers.ALL.map((x) => x.getInfo().commands)
      .flat()
      .sort(alphabeticallyBy((command) => command.type));
    const singleCommand =
      message.args.length === 1 &&
      commands.find((command) => command.type === message.args[0]);

    if (!!singleCommand) {
      print(singleCommand, message);
    } else {
      printAll(commands, message);
    }
  }
}

export default class HelpHandler extends Handler {
  getInfo(): HandlerInfo {
    return { commands: [new HelpCommand({})] };
  }
}
