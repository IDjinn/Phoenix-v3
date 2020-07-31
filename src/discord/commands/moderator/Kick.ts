import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class KickCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'kick',
            category: 'moderator',
            permissionsNeed: ['KICK_MEMBERS'],
            botPermissionsNeed: ['KICK_MEMBERS'],
        });
    }
    public async run({ ctx }: ICommandParameters) {
        const member = ctx.getMember();
        const reason = ctx.argsLeft().join(' ') || ctx.t('commands.kick.generic.no-reason');
        if (member.kickable) {
            return member.kick(reason).catch(error => ctx.replyT('commands.kick.erros.discord-api-error', error.message))
                .then(() => ctx.replyT('commands.kick.sucess', member.displayName));
        }
        else {
            return ctx.replyT('commands.kick.errors.not-kickable');
        }
    }
}