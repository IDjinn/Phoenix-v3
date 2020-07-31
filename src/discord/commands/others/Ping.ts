import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";

export default class PingCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'ping',
            category: 'others',
        });
    }
    public async run({ ctx }: ICommandParameters) {
        return ctx.replyT('commands.ping.sucess', Phoenix.getClient().ws.ping.toFixed(0));
    }
}