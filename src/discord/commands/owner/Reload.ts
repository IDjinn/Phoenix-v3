import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";

export default class ReloadCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'reload',
            onlyOwner: true,
            category: 'owner',
            subCommands: [{methodName: 'textController'}]
        });
    }

    public run({ }) {
        
    }

    public async textController({ message }: ICommandParameters) {
        Phoenix.getTextController().destroy();
        Phoenix.getTextController().init();
        return message.reply('done');
    }
}