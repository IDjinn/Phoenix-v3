import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class KickCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'kick',
            description: 'Kick an guild member.',
            permissionsNeed: ['KICK_MEMBERS'],
            botPermissionsNeed: ['KICK_MEMBERS'],
            aliases: ['expulsar', 'kickar', 'chutar']
        });
    }
    public run({ message, args, t }: ICommandParameters) {
        if (!args || args.length === 0)
            return message.reply(t('commands.kick.errors.no-member'));

        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply(t('commands.kick.errors.member-not-found'));

        const reason = args.slice(1).join(' ') || t('commands.kick.generic.no-reason');
        if (member.kickable) {
            return member.kick(reason).catch(error =>  message.reply(t('commands.kick.erros.discord-api-error', error.message)))
                .then(() => message.reply(t('commands.kick.sucess', member.displayName)));
        }
        else {
            return message.reply(t('commands.kick.errors.cant-kickable'));
        }
    }
}