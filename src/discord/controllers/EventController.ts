import Phoenix from "../Phoenix";
import { GuildChannel, Message, GuildMember } from "discord.js";
import PermissionsModule, { RolePermissions } from "../modules/PermissionsModule";
import AutomodModule from "../modules/AutomodModule";
import LevelModule from "../modules/LevelModule";
import LoggerModule from "../modules/LoggerModule";
import WelcomeModule from "../modules/WelcomeModule";
import CounterModule from "../modules/CounterModule";
import Server from "../structures/Server";

export default class EventController {
    public init() {
        Phoenix.getClient().on('guildCreate', guild => Phoenix.getServerController().getOrCreateServer(guild.id, guild));

        Phoenix.getClient().on('guildDelete', guild => Phoenix.getServerController().deleteServer(guild.id));

        Phoenix.getClient().on('message', async (message: Message) => {
            if (message.author.bot || ['dm', 'voice', 'category', 'group'].includes(message.channel.type))
                return;

            if (!message.guild || !message.member || message.type !== 'DEFAULT' || !message.guild.me)
                return;

            const server = await Phoenix.getServerController().getOrCreateServer(message.guild.id, message.guild);
            if (AutomodModule.messageFiltred(message, server, message.member.roles.cache.array()))
                return;

            if (message.content.startsWith(`<@!${message.guild.me.id}>`)) {
                message.reply(server.t('command-error.my-mention', server.prefix));
                return;
            }

            const user = await Phoenix.getPhoenixUserController().getOrCreateUser(message.author.id, message.author);
            Phoenix.getCommandController().handledCommand(message, server, user);
            LevelModule.giveMessageXp(server, message, user);
        });
        /* todo send a text file with messages deleted.
                Phoenix.getClient().on('messageDeleteBulk', messages => {
                    messages = messages.filter(message => !message.author.bot && !['dm', 'voice', 'category', 'group'].includes(message.channel.type) && message.type === 'DEFAULT');
                    if (messages) {
                        const server = Phoenix.getServerController().getOrCreateServer(messages.first().guild.id);
                        if (server instanceof Server) {/*
                            if (server.getPermissions().hasPermission(message.first().member.roles.array(), RolePermissions.bypassLogger))
                                return;
                        
                            LoggerModule.onMessageDeleted(message);
                        }
                    }
                });*/

        Phoenix.getClient().on('messageDelete', (message: Message) => {
            if (message.author.bot || ['dm', 'voice', 'category', 'group'].includes(message.channel.type) || !message.guild ||
                !message.member || message.type !== 'DEFAULT')
                return;

            const server = Phoenix.getServerController().getServer(message.guild.id);
            if (server instanceof Server && !PermissionsModule.hasPermission(message.member.roles.cache.array(), server.getRoles(), RolePermissions.bypassLogger))
                    LoggerModule.onMessageDeleted(server, message);
        });

        Phoenix.getClient().on('messageUpdate', async (oldMessage: Message, newMessage: Message) => {
            if (newMessage.author.bot || ['dm', 'voice', 'category', 'group'].includes(newMessage.channel.type) ||
                oldMessage.cleanContent == newMessage.cleanContent || newMessage.type !== 'DEFAULT' || !newMessage.guild ||
                !newMessage.member)
                return;

            const server = Phoenix.getServerController().getServer(newMessage.guild.id);
            if (server instanceof Server) {
                if (AutomodModule.messageFiltred(newMessage, server, newMessage.member.roles.cache.array()))
                    return;

                if (!PermissionsModule.hasPermission(newMessage.member.roles.cache.array(), server.getRoles(), RolePermissions.bypassLogger))
                    LoggerModule.onMessageUpdated(server, oldMessage, newMessage);

                const user = await Phoenix.getPhoenixUserController().getOrCreateUser(newMessage.author.id, newMessage.author);
                if (Phoenix.getCommandController().handledCommand(newMessage, server, user))
                    return;
            }
        });

        Phoenix.getClient().on('guildMemberAdd', (member: GuildMember) => {
            if (member.user.bot)
                return;

            const server = Phoenix.getServerController().getServer(member.guild.id);
            if (server instanceof Server) {
                WelcomeModule.onMemberJoin(server, member);
                CounterModule.updateCounters(server);
            }
        });

        Phoenix.getClient().on('guildMemberRemove', async (member: GuildMember) => {
            if (member.user.bot)
                return;

            const server = Phoenix.getServerController().getServer(member.guild.id);
            if (server instanceof Server) {
                WelcomeModule.onMemberLeave(server, member);
                CounterModule.updateCounters(server);
            }
        });

        Phoenix.getClient().on('channelCreate', channel => {
            if (channel instanceof GuildChannel) {
                const server = Phoenix.getServerController().getServer(channel.guild.id);
                if (server instanceof Server)
                    LoggerModule.onChannelCreated(server, channel);
            }
        });

        Phoenix.getClient().on('channelDelete', channel => {
            if (channel instanceof GuildChannel) {
                const server = Phoenix.getServerController().getServer(channel.guild.id);
                if (server instanceof Server)
                    LoggerModule.onChannelDeleted(server, channel);
            }
        });
        /* TODO REMAKE THIS
                Phoenix.getClient().on('roleUpdate', async (oldRole, newRole) => {
                    if (!oldRole.guild.me || !oldRole.guild.me.hasPermission('VIEW_AUDIT_LOG'))
                        return;
                    
                    let changes = '';
                    const auditLogs = await oldRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE', limit: 1 });
                    const log = auditLogs.entries.first();
                    if (log && log.changes) {
                        for (const change of log.changes) {
                            const { key: _key, old: _old, new: _new } = change;
                            let before = '';
                            let after = '';
                            if (_key === 'permissions') {
                                let beforePermissions = new Permissions(_old).toArray();
                                let afterPermissions = new Permissions(_new).toArray();/*
                                for (const afterPermission of afterPermissions) {
                                    if (beforePermissions.includes(afterPermission))
                                        continue;
                                    TODO: REAMKE THIS
                                    before += afterPermission + ', ';
                                }
                                for (const beforePermission of beforePermissions) {
                                    if (afterPermissions.includes(beforePermission))
                                        continue;
                                    
                                    after += beforePermission + ', ';
                                }
                                for (let i = 0; i < 100; i++){
                                    if(beforePermissions)
                                }
                                after = afterPermissions.join(', ');
                                before = beforePermissions.join(', ');
                            }
                            const type = _key.replace('name', 'Nome').replace('permissions', 'Permissões').replace('mentionable', 'Mencionável?')
                                .replace('hoist', 'Destacádo?').replace('color', 'Cor').replace('position', 'Posição');
                            before = `${before}`.replace('true', 'Sim').replace('false', 'Não');
                            after = `${after}`.replace('true', 'Sim').replace('false', 'Não');
                            changes += type + ':\nBefore: ' + before + ' -  After: ' + after + '\n\n';
                        }
                    }
                    const server = Phoenix.getServerController().getOrCreateServer(newRole.guild.id, newRole.guild);
                    LoggerModule.onRoleUpdated(server, log, changes, newRole);
                });
        
                Phoenix.getClient().on('channelUpdate', async (oldChannel, newChannel) => {
                    if (newChannel instanceof GuildChannel && oldChannel !== newChannel) {
                        if (!newChannel.guild.me || !newChannel.guild.me.hasPermission('VIEW_AUDIT_LOG'))
                            return;
                        
                        let changes = '';
                        const auditLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 1 });
                        const log = auditLogs.entries.first();
                        if (log && log.changes) {
                            for (const change of log.changes) {
                                const { key: _key, old: _old, new: _new } = change;
                                const type = _key.replace('name', 'Nome').replace('position', 'Posição')
                                    .replace('topic', 'Tópico').replace('nsfw', 'NSFW?').replace('rate_limit_per_user', 'SlowMode')
                                    .replace('bitrate', 'BitRate').replace('userLimit', 'Limite de Usuários');
                                const before = `${_old}`.replace('true', 'Sim').replace('false', 'Não').replace('undefined', 'Não Definido!');
                                const after = `${_new}`.replace('true', 'Sim').replace('false', 'Não');
                                changes += type + ':\nBefore: ' + before + ' -  After: ' + after + '\n\n';
                            }
                        }
                        const server = Phoenix.getServerController().getOrCreateServer(newChannel.guild.id, newChannel.guild);
                        LoggerModule.onChannelUpdate(server, log, changes, newChannel);
                    }
                });
        */
        Phoenix.getClient().on('guildUpdate', async (_oldGuild, newGuild) => {
            if (!newGuild.me || !newGuild.me.hasPermission('VIEW_AUDIT_LOG'))
                return;
            
            const server = Phoenix.getServerController().getServer(newGuild.id);
            if (server instanceof Server) {
                let changes = '';
                const auditLogs = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE', limit: 1 });
                const log = auditLogs.entries.first();
                if (log && log.changes) {
                    for (const change of log.changes) {
                        const { key: _key, old: _old, new: _new } = change;
                        let before = '' + _old;
                        let after = '' + _new;
                        switch (_key) {
                            case 'default_message_notifications': {
                                after = after.replace('0', 'All Messages').replace('1', 'Only @mentions');
                                before = before.replace('0', 'All Messages').replace('1', 'Only @mentions');
                                break;
                            };
                            case 'afk_timeout': {
                                after = parseInt(after) / 60 + ' minute(s)';
                                before = parseInt(before) / 60 + ' minute(s)';
                                break;
                            };
                            case 'system_channel_id':
                            case 'afk_channel_id': {
                                let afterChannel = newGuild.channels.cache.get(after);
                                let beforeChannel = newGuild.channels.cache.get(before);
                                if (after && afterChannel) after = afterChannel.name;
                                if (before && beforeChannel) before = beforeChannel.name;
                                break;
                            };
                        }

                        const type = _key.replace('name', 'Name').replace('region', 'Region')
                            .replace('verification_level', 'Protection Level').replace('explicit_content_filter', 'NSWF Filter?').replace('afk_channel_id', 'AFK Channel')
                            .replace('system_channel_id', 'Welcome Channel').replace('afk_timeout', 'AFK Time').replace('widget_enabled', 'Widget Enabled?')
                            .replace('icon_hash', 'Icon Id').replace('owner', 'Owner').replace('default_message_notifications', 'Notification Default Settings');
                        before = before.replace('true', 'True').replace('false', 'False').replace('undefined', 'Undefined!');
                        after = after.replace('true', 'True').replace('false', 'False').replace('undefined', 'Undefined!');
                        changes += type + ':\nBefore: ' + before + ' -  After: ' + after + '\n\n';
                    }
                }
                LoggerModule.onGuildUpdated(server, log, changes);
            }
        });

    }

    public destroy() {
        Phoenix.getClient().removeAllListeners();
    }
}