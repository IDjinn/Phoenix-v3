import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";

export default class PingCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'ping',
            category: 'others',
        });
    }
    public async run({ message, phoenixUser }: ICommandParameters) {
        return message.channel.send(phoenixUser.t('commands.ping.sucess', Phoenix.getClient().ws.ping.toFixed(0)));
    }
}