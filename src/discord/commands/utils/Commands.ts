import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";

export default class CommandsCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'commands',
            description: 'Show the command\'s list.',
            aliases: ['comandos', 'ajuda', 'help']
        });
    }

    public run({ message }: ICommandParameters) {
        return message.reply(Phoenix.getCommandManager().getCommands().keys.toString());
    }
}