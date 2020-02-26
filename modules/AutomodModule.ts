import AbstractModule from "../structures/AbstractModule";
import { Message, Role, User, Guild, TextChannel, GuildMember } from "discord.js";
import Server from "../structures/Server";
import { RolePermissions } from "./PermissionsModule";
import { Collection } from "discord.js";
import WarnSchema from "../schemas/WarnSchema";

const linksPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const discordInvitesPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)? ((?:discord\.gg|discordapp\.com))/gi;

export default class AutomodModule extends AbstractModule {
    public readonly config: IAutomod;
    private actions = new Collection<number, IAutomodAction>();
    constructor(data: IAutomod, server: Server) {
        super('Automod', server);
        this.config = data;
    }
    public init(): void {
        for (const action of this.config.actions || []) {
            this.actions.set(action.count, action);
        }
    }

    public destroy(): void {
        this.actions.clear();
    }

    public messageFiltred(message: Message, roles: Role[]): boolean {
        if (this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.bypassAutomod)
           )// || message.member.hasPermission('MANAGE_GUILD', false, true, true))
            return false;
        
        if (this.config.invites.enabled && this.hasInvites(message, roles))
            return true;
        else if (this.config.links.enabled && this.hasLinks(message, roles))
            return true;
        
        return false;
    }

    public hasInvites(message: Message, roles: Role[]): boolean {
        if (!message.cleanContent.match(discordInvitesPattern))
            return false;
        
        if (this.config.invites.whitelist.includes(message.channel.id))
            return false;
        
        if (this.config.invites.blacklist.includes(message.channel.id) &&
            !this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.sendInivites))
            return false;
        
        message.delete().catch();
        this.warn(message.member, message.guild.me, 'Posted a invite');
        return true;
    }

    public hasLinks(message: Message, roles: Role[]): boolean {
        if (!message.cleanContent.match(linksPattern))
            return false;
        
        if (this.config.invites.whitelist.includes(message.channel.id))
            return false;
        
        if (this.config.invites.blacklist.includes(message.channel.id) &&
            !this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.sendInivites))
            return false;
        
        message.delete().catch();
        this.warn(message.member, message.guild.me, 'Posted a link');
        return true;
    }

    public warn(member: GuildMember, punisher: GuildMember, reason?: string) {
        if (this.actions.size > 0) {
            WarnSchema.count({ userId: member.id, guildId: member.guild.id }).then((count) => {
                const action = this.actions.get(count + 1);
                if (action) {
                    switch (action.action) {
                        case 'BAN':
                            member.ban(reason).catch();
                            break;
                        case 'KICK':
                            member.kick(reason).catch();
                        //TODO warn and mute
                    }
                }
            });
            new WarnSchema({
                userId: member.id,
                guildId: member.guild.id,
                punisherId: punisher.id,
                reason: reason,
            }).save();
            
            let channel = member.guild.channels.get(this.config.warnsChannel);
            if (channel instanceof TextChannel)
                channel.send('a');
        }
    }
}

export interface IAutomod{
    invites: {
        enabled: boolean;
        whitelist: string[];
        blacklist: string[];
    },
    links: {
        enabled: boolean;
        whitelist: string[];
        blacklist: string[];
    }
    actions: IAutomodAction[];
    warnsChannel: string;
}
// 5 invites -> auto ban
export interface IAutomodAction{
    count: number,
    action: 'WARN' | 'MUTE' | 'KICK' | 'BAN'
}