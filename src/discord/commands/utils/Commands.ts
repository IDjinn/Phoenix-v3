import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";
import { MessageEmbed } from "discord.js";
import Constants from "../../util/Constants";
import PermissionsModule, { RolePermissions } from "../../modules/PermissionsModule";
export default class CommandsCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'commands',
            category: 'utils'
        });
    }

    public run({ message, server }: ICommandParameters) {
        if (!message.member)
            throw 'member === null';
        
        const commands = Phoenix.getCommandController().getCommands();
        const embed = new MessageEmbed()
            .setTitle('Commands')
            .addField('Fun', `\`${commands.filter(c => c.category === 'fun' && c.enabled).map(c => c.name).join(', ')}\``)
            .addField('Others', `\`${commands.filter(c => c.category === 'others' && c.enabled).map(c => c.name).join(', ')}\``)
            .addField('Utils', `\`${commands.filter(c => c.category === 'utils' && c.enabled).map(c => c.name).join(', ')}\``);
        if (Constants.OWNERS_LIST.includes(message.author.id))
            embed.addField('Owner', `\`${commands.filter(c => c.category === 'owner' && c.enabled).map(c => c.name).join(', ')}\``);
        if (message.member.hasPermission('MANAGE_GUILD'))
            embed.addField('Administrator', `\`${commands.filter(c => c.category === 'administrator' && c.enabled).map(c => c.name).join(', ')}\``)
        if (PermissionsModule.hasPermission(message.member.roles.cache.array(), server.getRoles(), RolePermissions.canWarn))
            embed.addField('Moderator', `\`${commands.filter(c => c.category === 'moderator' && c.enabled).map(c => c.name).join(', ')}\``)
        return message.channel.send(embed);
    }
}