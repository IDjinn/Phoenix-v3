import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import PermissionsModule, { RolePermissions } from "../../modules/PermissionsModule";
import AutomodModule from "../../modules/AutomodModule";

export default class WarnCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'warn',
            description: 'Warn a member',
            rolePermissionsNeed: [RolePermissions.canWarn]
        });
    }

    public run({ message, args, server, t }: ICommandParameters) {
        if (!args)
            return message.reply(t('commands.warn.errors.no-member'));

        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply(t('commands.warn.errors.member-not-found'))
        else if (member.id === message.member.id)
            return message.reply(t('commands.warn.errors.cannot-warn-yourself'));
        else if (member.user.bot)
            return message.reply(t('commands.warn.errors.cannot-warn-bot'));
        else if (PermissionsModule.hasPermission(member.roles.array(), server.getRoles(), RolePermissions.bypassAutomod))
            return message.reply(t('commands.warn.errors.member-bypass-moderation'));
        else {
            const reason = args.slice(1).join(' ') || t('commands.warn.generic.no-reason')
            AutomodModule.warn(server, member, message.member, reason);
            return message.reply(t('commands.warn.sucess'));
        }
    }
}