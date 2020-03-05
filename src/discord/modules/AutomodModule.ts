import AbstractModule from "../structures/AbstractModule";
import { Message, Role, TextChannel, GuildMember, DiscordAPIError, NewsChannel } from "discord.js";
import Server from "../structures/Server";
import { RolePermissions } from "./PermissionsModule";
import { Collection } from "discord.js";
import WarnSchema from "../schemas/WarnSchema";
import Constants from "../util/Constants";
import {  EmbedWithTitle } from "../util/EmbedFactory";
import Phoenix from "../Phoenix";

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
            // || message.member.hasPermission('MANAGE_GUILD', false, true, true))
            || this.config.whitelist.includes(message.channel.id)) return false;

        if (this.config.invites.enabled && this.hasInvites(message, roles))
            return true;
        else if (this.config.links.enabled && this.hasLinks(message, roles))
            return true;
        else if (this.config.dupChars.enabled && this.hasDupChars(message, roles))
            return true;
        else if (this.config.capsLock.enabled && this.hasCapsLock(message, roles))
            return true;
        else if (this.config.massMention.enabled && this.hasMassMention(message, roles))
            return true;

        return false;
    }

    public hasInvites(message: Message, roles: Role[]): boolean {
        if (!message.cleanContent.match(Constants.DISCORD_INVITES_REGEX))
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
        if (!message.cleanContent.match(Constants.LINKS_REGEX))
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

    public hasDupChars(message: Message, roles: Role[]): boolean {
        if (this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.ignoreDupChars))
            return false;

        const matches = message.cleanContent.match(Constants.DUPLICATED_CHARS_REGEX);
        const oldMessageLength = message.cleanContent.length;
        let newMessage = message.cleanContent;
        if (matches) {
            for (const match of matches) {
                newMessage = newMessage.replace(match, match.charAt(0));
            }
            if ((oldMessageLength - newMessage.length) / 100 > this.config.dupChars.percent) {
                message.delete().catch();
                this.warn(message.member, message.guild.me, `Dup chars (${(oldMessageLength - newMessage.length) / 100}%)`);
                return true;
            }
        }
        return false;
    }

    public hasCapsLock(message: Message, roles: Role[]): boolean {
        if (this.getServer().getPermissionsModule().hasPermission(roles, RolePermissions.ignoreCapsLock))
            return false;

        const matches = message.cleanContent.match(Constants.CAPS_LOCK_REGEX);
        const oldMessageLength = message.cleanContent.length;
        let newMessage = message.cleanContent;
        if (matches) {
            for (const match of matches) {
                newMessage = newMessage.replace(match, match.charAt(0));
            }
            if ((oldMessageLength - newMessage.length) / 100 > this.config.capsLock.percent) {
                message.delete().catch();
                this.warn(message.member, message.guild.me, `Caps Lock (${(oldMessageLength - newMessage.length) / 100}%)`);
                return true;
            }
        }
        return false;
    }

    public hasMassMention(message: Message, memberRoles: Role[]): boolean {
        if (this.getServer().getPermissionsModule().hasPermission(memberRoles, RolePermissions.ignoreCapsLock))
            return false;

        const { channels, users, everyone, roles } = message.mentions;
        const totalMentions = channels.size + users.size + (everyone ? 1 : 0) + roles.size;
        if (totalMentions > this.config.massMention.count) {
            message.delete().catch();
            this.warn(message.member, message.guild.me, `Mass Mentions (${totalMentions})`);
            return true;
        }
        return false;
    }

    public warn(member: GuildMember, punisher: GuildMember, reason: string) {
        if (this.actions.size > 0) {
            WarnSchema.countDocuments({ userId: member.id, guildId: member.guild.id }).then((count) => {
                const action = this.actions.get(count + 1) || this.actions.first();
                const channel = member.guild.channels.get(this.config.warnsChannel);
                const server = Phoenix.getServerManager().getOrCreateServer(punisher.guild.id, punisher.guild);
                if (channel instanceof TextChannel || channel instanceof NewsChannel) {
                    if (action) {
                        switch (action.action) {
                            case 'BAN':
                                if (member.bannable) {
                                    member.ban(reason).catch((error: DiscordAPIError) => {
                                        channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-error', reason), server.t('automod:warns.erros.discord-api-error', error.message, punisher.toString(), punisher.user.username, punisher.user.discriminator)));
                                    });
                                }
                                else {
                                    channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-alert'), server.t('automod:warns.erros.missing-permissions', member.toString(), member.user.username, member.user.discriminator,member.id, reason, punisher.toString(),punisher.user.username,punisher.user.discriminator,punisher.id)));
                                }
                                break;
                            case 'KICK':
                                if (member.kickable) {
                                    member.kick(reason).catch((error: DiscordAPIError) => {
                                        channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-error', reason), server.t('automod:warns.erros.discord-api-error', error.message, punisher.toString(), punisher.user.username, punisher.user.discriminator)));
                                    });
                                }
                                else {
                                    channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-alert'), server.t('automod:warns.erros.missing-permissions', member.toString(), member.user.username, member.user.discriminator,member.id, reason, punisher.toString(),punisher.user.username,punisher.user.discriminator,punisher.id)));
                                }
                            //TODO warn and mute
                        }
                    }
                }
                new WarnSchema({
                    userId: member.id,
                    guildId: member.guild.id,
                    punisherId: punisher.id,
                    reason: reason,
                }).save();
            });
        }
    }
}

export interface IAutomod {
    invites: {
        enabled: boolean;
        whitelist: string[];
        blacklist: string[];
    },
    links: {
        enabled: boolean;
        whitelist: string[];
        blacklist: string[];
    },
    dupChars: {
        enabled: boolean;
        percent: number;
    },
    capsLock: {
        enabled: boolean;
        percent: number;
    },
    massMention: {
        enabled: boolean;
        count: number;
    }
    actions: IAutomodAction[];
    warnsChannel: string;
    whitelist: string[];
}
// 5 invites -> auto ban
export interface IAutomodAction {
    count: number,
    action: 'WARN' | 'MUTE' | 'KICK' | 'BAN'
}