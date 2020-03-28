import AbstractCommand, {ICommandParameters } from "../../structures/AbstractCommand";
import AutomodModule from "../../modules/AutomodModule";

export default class MuteCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'mute',
            category: 'moderator',
            description: 'Mute a user'
        });
    }
    public run({ message, server, phoenixUser, args }: ICommandParameters) {
        if (message.member && message.guild && message.guild.me)
            AutomodModule.mute(message.member, message.guild.me, phoenixUser, server, args.join(' '));
        return message.channel.send('a');
    }
}