import AbstractModule from "../structures/AbstractModule";
import { Message } from "discord.js";
import Server from "../structures/Server";
import { RolePermissions } from "./PermissionsModule";

const linksPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const discordInvitesPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)? ((?:discord\.gg|discordapp\.com))/gi;

export default class AutomodModule extends AbstractModule {
    public readonly config: IAutomod;
    constructor(data: IAutomod, server: Server) {
        super('Automod', server);
        this.config = data;
    }
    public init(): void {
        
    }

    public destroy(): void {
        
    }

    public messageFiltred(message: Message, roles: string[]): boolean {
        if (this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.bypassAutomod)
            || message.member.hasPermission('MANAGE_GUILD', false, true, true))
            return false;
        
        if (this.config.invites.enabled && this.hasInvites(message, roles))
            return true;
        else if (this.config.links.enabled && this.hasLinks(message, roles))
            return true;
        
        return false;
    }

    public hasInvites(message: Message, roles: string[]): boolean {
        if (!message.cleanContent.match(discordInvitesPattern))
            return false;
        
        if (this.config.invites.whitelist.includes(message.channel.id))
            return false;
        
        if (this.config.invites.blacklist.includes(message.channel.id) &&
            !this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.sendInivites))
            return false;
        
        message.delete().catch();
        return true;
    }

    public hasLinks(message: Message, roles: string[]): boolean {
        if (!message.cleanContent.match(linksPattern))
            return false;
        
        if (this.config.invites.whitelist.includes(message.channel.id))
            return false;
        
        if (this.config.invites.blacklist.includes(message.channel.id) &&
            !this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.sendInivites))
            return false;
        
        message.delete().catch();
        return true;
    }
}

export interface IAutomod{
    invites: {
        enabled: boolean
        whitelist: string[],
        blacklist: string[]
    },
    links: {
        enabled: boolean
        whitelist: string[],
        blacklist: string[]
    };
}