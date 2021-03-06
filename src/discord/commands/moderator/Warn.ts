import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import PermissionsModule, { RolePermissions } from "../../modules/PermissionsModule";
import AutomodModule from "../../modules/AutomodModule";

export default class WarnCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'warn',
            description: 'Warn a member',
            category: 'moderator',
            rolePermissionsNeed: [RolePermissions.canWarn]
        });
    }

    public run({ message, args, server, phoenixUser }: ICommandParameters) {
        if (!message.guild || !message.member)
            throw `message.guild === null`;

        if (args.length === 0)
            return message.reply(phoenixUser.t('commands.warn.errors.no-member'));

        const member = message.mentions.members ? message.mentions.members.first() : null || message.guild.members.cache.get(args[0]);
        if (!member)
            return message.reply(phoenixUser.t('commands.warn.errors.member-not-found'))
        else if (member.id === message.member.id)
            return message.reply(phoenixUser.t('commands.warn.errors.cannot-warn-yourself'));
        else if (member.user.bot)
            return message.reply(phoenixUser.t('commands.warn.errors.cannot-warn-bot'));
        else if (PermissionsModule.hasPermission(member.roles.cache.array(), server.getRoles(), RolePermissions.bypassAutomod))
            return message.reply(phoenixUser.t('commands.warn.errors.member-bypass-moderation'));
        else {
            const reason = args.slice(1).join(' ') || phoenixUser.t('commands.warn.generic.no-reason')
            AutomodModule.warn(server, member, message.member, reason);
            return message.reply(phoenixUser.t('commands.warn.sucess'));
        }
    }
}