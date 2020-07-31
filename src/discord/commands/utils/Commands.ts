import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";
import { MessageEmbed } from "discord.js";
import Constants from "../../util/Constants";
import PermissionsModule, { RolePermissions } from "../../modules/PermissionsModule";
export default class CommandsCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'commands',
            category: 'utils',
            botPermissionsNeed: ['EMBED_LINKS']
        });
    }

    public run({ message, server ,ctx}: ICommandParameters) {
        const commands = Phoenix.getCommandController().getCommands();
        const embed = new MessageEmbed()
            .setTitle('Commands')
            .addField('Fun', `\`${commands.filter(c => c.category === 'fun' && c.enabledForContext(message.author.id)).map(c => c.name).join(', ')}\``)
            .addField('Others', `\`${commands.filter(c => c.category === 'others' && c.enabledForContext(message.author.id)).map(c => c.name).join(', ')}\``)
            .addField('Utils', `\`${commands.filter(c => c.category === 'utils' && c.enabledForContext(message.author.id)).map(c => c.name).join(', ')}\``);
        if (Constants.OWNERS_LIST.includes(message.author.id))
            embed.addField('Owner', `\`${commands.filter(c => c.category === 'owner' && c.enabledForContext(message.author.id)).map(c => c.name).join(', ')}\``);
        if (ctx.member.hasPermission('MANAGE_GUILD'))
            embed.addField('Administrator', `\`${commands.filter(c => c.category === 'administrator' && c.enabledForContext(message.author.id)).map(c => c.name).join(', ')}\``)
        if (PermissionsModule.hasPermission(ctx.member.roles.cache.array(), server.getRoles(), RolePermissions.canWarn))
            embed.addField('Moderator', `\`${commands.filter(c => c.category === 'moderator' && c.enabledForContext(message.author.id)).map(c => c.name).join(', ')}\``)
        return message.channel.send(embed);
    }
}