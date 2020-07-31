import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { MessageEmbed } from "discord.js";
import Constants from "../../util/Constants";

export default class BotinfoCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'botinfo',
            category: 'others',
            botPermissionsNeed: ['EMBED_LINKS']
        });
    }
    public async run({ message }: ICommandParameters) {
        const embed = new MessageEmbed().setColor(Constants.WHITE_PHOENIX).setTimestamp()
            .setTitle(`${message.client.user!.username}'s Info`)
            .addField('Guilds', message.client.guilds.cache.size)
            .addField('Users', message.client.users.cache.size)
            .addField('Version', Constants.VERSION)
            .addField('RAM Usage', Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB');
        return message.channel.send(embed).catch();
    }
}