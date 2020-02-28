import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { RichEmbed } from "discord.js";
import Constants from "../../util/Constants";
import Phoenix from "../../Phoenix";

export default class BotinfoCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'botinfo',
            description: 'Show a short description about bot info.'
        });
    }
    public run({ message }: ICommandParameters): void {
        const client = message.client;
        const embed = new RichEmbed().setColor(Constants.WHITE_PHOENIX).setTimestamp()
            .setTitle(`${client.user.username}'s Info`)
            .addField('Guilds', client.guilds.size)
            .addField('Users', client.users.size)
            .addField('Version', Constants.VERSION)
            .addField('RAM Usage', Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB');
        message.channel.send(embed).catch();
    }
}