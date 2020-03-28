import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class PingCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'ping',
            description: 'Show the bot latency.',
            category: 'others'
        });
    }
    public async run({ message }: ICommandParameters) {
        return message.channel.send(message.client.ws.ping.toFixed(0) + 'ms.');
    }
}