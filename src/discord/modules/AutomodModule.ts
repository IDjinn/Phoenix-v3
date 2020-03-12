import { Message, Role, TextChannel, GuildMember, DiscordAPIError, NewsChannel } from "discord.js";
import PermissionsModule, { RolePermissions } from "./PermissionsModule";
import WarnSchema from "../schemas/WarnSchema";
import Constants from "../util/Constants";
import { EmbedWithTitle } from "../util/EmbedFactory";
import ServerSchema from "../schemas/ServerSchema";
import Server from "../structures/Server";

export default class AutomodModule {
    public static messageFiltred(message: Message, server: Server, roles: Role[]): boolean {
        if (!server.getAutomod().enabled)
            return false;

        if (PermissionsModule.hasPermission(roles, server.getRoles(), RolePermissions.bypassAutomod)
            || server.getAutomod().whitelist.includes(message.channel.id)) return false;

        if (server.getAutomod().invites.enabled && AutomodModule.hasInvites(message, server, roles))
            return true;
        else if (server.getAutomod().links.enabled && AutomodModule.hasLinks(message, server, roles))
            return true;
        else if (server.getAutomod().dupChars.enabled && AutomodModule.hasDupChars(message, server, roles))
            return true;
        else if (server.getAutomod().capsLock.enabled && AutomodModule.hasCapsLock(message, server, roles))
            return true;
        else if (server.getAutomod().massMention.enabled && AutomodModule.hasMassMention(message, server, roles))
            return true;

        return false;
    }

    public static hasInvites(message: Message, server: Server, roles: Role[]): boolean {
        if (!message.content.match(Constants.DISCORD_INVITES_REGEX))
            return false;

        if (server.getAutomod().invites.whitelist.includes(message.channel.id))
            return false;

        if (server.getAutomod().invites.blacklist.includes(message.channel.id) &&
            PermissionsModule.hasPermission(roles, server.getRoles(), RolePermissions.sendInivites))
            return false;

        message.delete().catch();
        this.warn(server, message.member, message.guild.me, 'Posted a invite');
        return true;
    }

    public static hasLinks(message: Message, server: Server, roles: Role[]): boolean {
        if (!message.content.match(Constants.LINKS_REGEX))
            return false;

        if (server.getAutomod().invites.whitelist.includes(message.channel.id))
            return false;

        if (server.getAutomod().invites.blacklist.includes(message.channel.id) &&
            PermissionsModule.hasPermission(roles, server.getRoles(), RolePermissions.sendInivites))
            return false;

        message.delete().catch();
        this.warn(server, message.member, message.guild.me, 'Posted a link');
        return true;
    }

    public static hasDupChars(message: Message, server: Server, roles: Role[]): boolean {
        if (PermissionsModule.hasPermission(roles, server.getRoles(), RolePermissions.ignoreDupChars))
            return false;

        const matches = message.content.match(Constants.DUPLICATED_CHARS_REGEX);
        const oldMessageLength = message.content.length;
        let newMessage = message.content;
        if (matches) {
            for (const match of matches) {
                newMessage = newMessage.replace(match, match.charAt(0));
            }
            if ((oldMessageLength - newMessage.length) / 100 > server.getAutomod().dupChars.percent) {
                message.delete().catch();
                this.warn(server, message.member, message.guild.me, `Dup chars (${(oldMessageLength - newMessage.length) / 100}%)`);
                return true;
            }
        }
        return false;
    }

    public static hasCapsLock(message: Message, server: Server, roles: Role[]): boolean {
        if (PermissionsModule.hasPermission(roles, server.getRoles(), RolePermissions.ignoreCapsLock))
            return false;

        const matches = message.content.match(Constants.CAPS_LOCK_REGEX);
        const oldMessageLength = message.content.length;
        let newMessage = message.content;
        if (matches) {
            for (const match of matches) {
                newMessage = newMessage.replace(match, match.charAt(0));
            }
            if ((oldMessageLength - newMessage.length) / 100 > server.getAutomod().capsLock.percent) {
                message.delete().catch();
                this.warn(server, message.member, message.guild.me, `Caps Lock (${(oldMessageLength - newMessage.length) / 100}%)`);
                return true;
            }
        }
        return false;
    }

    public static hasMassMention(message: Message, server: Server, memberRoles: Role[]): boolean {
        if (PermissionsModule.hasPermission(memberRoles, server.getRoles(), RolePermissions.ignoreCapsLock))
            return false;

        const { channels, users, everyone, roles } = message.mentions;
        const totalMentions = channels.size + users.size + (everyone ? 1 : 0) + roles.size;
        if (totalMentions > server.getAutomod().massMention.count) {
            message.delete().catch();
            this.warn(server, message.member, message.guild.me, `Mass Mentions (${totalMentions})`);
            return true;
        }
        return false;
    }

    public static punishment(server: Server, member: GuildMember, punisher: GuildMember, reason: string, iAutomodAction: IAutomodAction): any {
        const channel = member.guild.channels.get(server.getAutomod().warnsChannel);
        //const user = Phoenix.getPhoenixUserController().getOrCreateUser(member.id, member.user);
        if ((channel instanceof TextChannel || channel instanceof NewsChannel) && server) {
            if (iAutomodAction) {
                switch (iAutomodAction.action) {
                    case 'BAN': {
                        if (member.bannable) {
                            return member.ban(reason).catch((error: DiscordAPIError) => {
                                channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-error', reason), server.t('automod:warns.erros.discord-api-error', error.message, punisher.toString(), punisher.user.username, punisher.user.discriminator))).catch();
                            });
                        }
                        else {
                            return channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-alert'), server.t('automod:warns.erros.missing-permissions', member.toString(), member.user.username, member.user.discriminator, member.id, reason, punisher.toString(), punisher.user.username, punisher.user.discriminator, punisher.id))).catch();
                        }
                    }
                    case 'KICK': {
                        if (member.kickable) {
                            return member.kick(reason).catch((error: DiscordAPIError) => {
                                channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-error', reason), server.t('automod:warns.erros.discord-api-error', error.message, punisher.toString(), punisher.user.username, punisher.user.discriminator))).catch();
                            });
                        }
                        else {
                            return channel.send(EmbedWithTitle(server.t('automod:warns.embed-title-alert'), server.t('automod:warns.erros.missing-permissions', member.toString(), member.user.username, member.user.discriminator, member.id, reason, punisher.toString(), punisher.user.username, punisher.user.discriminator, punisher.id))).catch();
                        }
                    }
                    case 'MUTE': {
                        if (member.manageable) {
                            /* const timestamp = `${Date.now() + 5 * 60_000}`; //todo: server mute queue
                            server.mutes.set(timestamp, { 
                                user: user,
                                member: member,
                                expiresAt: timestamp,
                                punisher: punisher.id,
                                reason: reason,
                                rolesToGive: member.roles.map(x => x.id)
                            });*/
                            member.removeRoles(member.roles).catch();
                            const role = member.guild.roles.get(server.muteRole);
                            if (role)
                                return member.addRole(role).catch();

                            return member.guild.createRole({ name: 'Muted', permissions: [] }).then(role => {
                                member.addRole(role).catch();
                                member.guild.channels.map(async channel => await channel.overwritePermissions(role, { SEND_MESSAGES: false }).catch());
                                server.muteRole = role.id;
                                ServerSchema.findOneAndUpdate({ id: server.id }, { muteRole: role.id });
                            }).catch();
                        }
                        break;
                    }
                    default:
                        //todo: Não deveria estar aqui? WARN já foi dado...
                        break;
                }
            }
        }
    }

    public static warn(server: Server, member: GuildMember, punisher: GuildMember, reason: string) {
        new WarnSchema({
            userId: member.id,
            guildId: member.guild.id,
            punisherId: punisher.id,
            reason: reason,
        }).save();
        if (server.getAutomod().actions) {
            WarnSchema.countDocuments({ userId: member.id, guildId: member.guild.id }, (_error: any, count: number) => {
                const action = server.getAutomod().actions.find(action => action.count === count) || server.getAutomod().actions[0];
                this.punishment(server, member, punisher, reason, action);
            });
        }
    }
}

export interface IAutomod {
    enabled: boolean;
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

export interface IAutomodAction {
    count: number,
    action: 'WARN' | 'MUTE' | 'KICK' | 'BAN'
}