import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { MessageEmbed } from "discord.js";
import Constants from "../../util/Constants";

export default class BotinfoCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'botinfo',
            category: 'others'
        });
    }
    public async run({ message }: ICommandParameters) {
        const client = message.client;
        if (!client.user)
            throw 'client.user === null';

        const embed = new MessageEmbed().setColor(Constants.WHITE_PHOENIX).setTimestamp()
            .setTitle(`${client.user.username}'s Info`)
            .addField('Guilds', client.guilds.cache.size)
            .addField('Users', client.users.cache.size)
            .addField('Version', Constants.VERSION)
            .addField('RAM Usage', Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB');
        return message.channel.send(embed).catch();
    }
}