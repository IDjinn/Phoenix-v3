import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed } from "../../util/EmbedFactory";

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
    public run({ message, args }: ICommandParameters) {
        if (!args)
            return message.channel.send(SimpleEmbed('You need put member id or mention it.'));
        
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.channel.send(SimpleEmbed('You need put member id or mention it.'));
        
        if (member.bannable && member.highestRole < message.member.highestRole) {
            member.ban('pq sim').catch().then();
        }
    }
}