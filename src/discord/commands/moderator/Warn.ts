import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { RolePermissions } from "../../modules/PermissionsModule";

export default class WarnCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'warn',
            description: 'Warn a member',
            rolePermissionsNeed: [RolePermissions.canWarn]
        });
    }
    
    public run({ message, args, server, t }: ICommandParameters) {
        if (!server)
            return; //why im here?
        
        if (!args)
            return message.reply(t('commands.warn.errors.no-member'));
        
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply(t('commands.warn.errors.member-not-found'))
        if (member.id === message.member.id)
            return message.reply(t('commands.warn.errors.cannot-warn-yourself'));
        if (member.id === message.guild.me.id)
            return message.reply(t('commands.warn.errors.cannot-warn-bot'));
        if (server.getPermissionsModule().hasPermission(member.roles.array(), RolePermissions.bypassAutomod))
            return message.reply(t('commands.warn.errors.member-bypass-moderation'));
        
        const reason = args.slice(1).join(' ') || t('commands.warn.generic.no-reason')
        server.getAutomodModule().warn(member, message.member, reason);
        return message.reply(t('commands.warn.sucess'));
    }
}