import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import AutomodModule from "../../modules/AutomodModule";

export default class MuteCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'mute',
            category: 'moderator',
            onlyOwner: true
        });
    }
    public run({ ctx }: ICommandParameters) {
        const member = ctx.getMember();
        return AutomodModule.mute(member, ctx.member, ctx.phoenixUser, ctx.server, ctx.argsLeft().join(' '));
        // return message.channel.send('a');
    }
}