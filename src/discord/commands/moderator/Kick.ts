import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed } from "../../util/EmbedFactory";

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
    public async run({ message, args }: ICommandParameters) {
        if (!args)
            return message.channel.send(SimpleEmbed('You need put member id or mention it.'));
        
        const member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.channel.send(SimpleEmbed('You need put member id or mention it.'));
        
        if (member.kickable && member.highestRole < message.member.highestRole) {
            member.kick('pq sim').catch();//todo make messages when sucess or error while kicking
        }
        return message.channel.send(SimpleEmbed('You dont have permissions to kick this member.'));
    }
}