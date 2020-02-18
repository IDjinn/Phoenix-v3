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
    public run({ message }): Promise<void> {
        return message.channel.send(message.client.ping);
    }
}