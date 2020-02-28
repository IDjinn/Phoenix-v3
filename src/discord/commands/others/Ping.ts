import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class PingCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'ping',
            description: 'Show the bot latency.'
        });
    }
    public run({ message }: ICommandParameters) {
        message.channel.send(message.client.ping.toFixed(0) + 'ms.');
    }
}