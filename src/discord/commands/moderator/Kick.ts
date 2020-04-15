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
    public async run({ message, args, phoenixUser }: ICommandParameters) {
        if (!message.guild)
            throw `message.guild === null`;

        if (args.length === 0)
            return message.reply(phoenixUser.t('commands.kick.errors.no-member'));

        const member = message.mentions.members ? message.mentions.members.first() : null || message.guild.members.cache.get(args[0]);
        if (!member)
            return message.reply(phoenixUser.t('commands.kick.errors.member-not-found'));

        const reason = args.slice(1).join(' ') || phoenixUser.t('commands.kick.generic.no-reason');
        if (member.kickable) {
            return member.kick(reason).catch(error =>  message.reply(phoenixUser.t('commands.kick.erros.discord-api-error', error.message)))
                .then(() => message.reply(phoenixUser.t('commands.kick.sucess', member.displayName)));
        }
        else {
            return message.reply(phoenixUser.t('commands.kick.errors.cant-kickable'));
        }
    }
}