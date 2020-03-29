import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class CommandsCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'commands',
            description: 'Show the command\'s list.',
            aliases: ['comandos', 'ajuda', 'help'],
            category: 'utils'
        });
    }

    public run({ message }: ICommandParameters) {/*
        let commandList = new Map<string, AbstractCommand[]>();
        new Collection(Phoenix.getCommandController().getCommands().arr)
        for (const command of Phoenix.getCommandController().getCommands().values()) {
            if (command instanceof AbstractCommand)
                commandList.set(command.category, push(command);
        }
        return message.reply(commandList);*/
        return Promise.resolve(message.content);
    }
}