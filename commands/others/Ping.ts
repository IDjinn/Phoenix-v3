import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class PingCommand extends AbstractCommand{
    constructor() {
        super('ping',
            'Show the bot latency',
            [],
            [],
            [],
            false,
            true);
    }
    public run({ message }: ICommandParameters) {
        message.channel.send(message.client.ping.toFixed(0) + 'ms.');
    }
}