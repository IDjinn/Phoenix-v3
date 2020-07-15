import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class BanCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'ban',
            category: 'moderator',
            permissionsNeed: ['BAN_MEMBERS'],
            botPermissionsNeed: ['BAN_MEMBERS']
        });
    }
    public async run({ ctx }: ICommandParameters) {
        const member = ctx.getMember();
        if (!member)
            return;

        const reason = ctx.argsLeft().join(' ') || ctx.t('commands.kick.generic.no-reason');
        if (member.bannable) {
            return member.ban({reason}).catch(error => ctx.replyT('commands.kick.erros.discord-api-error', error.message))
                .then(() => ctx.replyT('commands.kick.sucess', member.displayName));
        }
        else {
            return ctx.replyT('commands.kick.errors.cant-banable');
        }
    }
}