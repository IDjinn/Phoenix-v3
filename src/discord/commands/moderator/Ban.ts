import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class BanCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban an guild member.',
            permissionsNeed: ['BAN_MEMBERS'],
            botPermissionsNeed: ['BAN_MEMBERS'],
            aliases: ['Banir']
        });
    }
    public run({ message, args, t }: ICommandParameters) {
        if (!args)
            return message.reply(t('commands.kick.errors.no-member'));
        
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply(t('commands.kick.errors.member-not-found'));
        
        const reason = args.slice(1).join(' ') || t('commands.kick.generic.no-reason');
        if (member.bannable) {
            member.ban(reason).catch(error => {
                return message.reply(t('commands.kick.erros.discord-api-error', error.message));
            }).then(() => {
                return message.reply(t('commands.kick.sucess'))
            });
        }
        else {
            return message.reply(t('commands.kick.errors.cant-banable'));
        }
        return;
    }
}