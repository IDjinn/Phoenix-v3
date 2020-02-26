import AbstractManager from "../structures/AbstractManager";
import Phoenix from "../Phoenix";
import { Guild, GuildChannel, TextChannel, NewsChannel, StoreChannel, Role } from "discord.js";
import ServerSchema from "../schemas/ServerSchema";
import Server from "../structures/Server";
import PhoenixUser from "../structures/PhoenixUser";
import PhoenixUserSchema from "../schemas/PhoenixUserSchema";
import { RolePermissions } from "../modules/PermissionsModule";

export default class EventManager extends AbstractManager {
    constructor() {
        super('EventManager');
    }

    public init() {
        Phoenix.getClient().on('ready', () => console.log('ready'));

        Phoenix.getClient().on('guildCreate', guild => Phoenix.getServerManager().getOrCreateServer(guild.id, guild));

        Phoenix.getClient().on('guildDelete', guild => Phoenix.getServerManager().deleteServer(guild.id));

        Phoenix.getClient().on('message', async message => {
            if (message.author.bot || ['dm', 'voice', 'category', 'group'].includes(message.channel.type) || message.type !== 'DEFAULT')
                return;
            
            let user = Phoenix.getPhoenixUserManager().getOrCreateUser(message.author.id, message.author);
            if (user instanceof PhoenixUser) {
                let server = Phoenix.getServerManager().getOrCreateServer(message.guild.id, message.guild);
                if (server instanceof Server) {
                    if (server.getAutomodModule().messageFiltred(message, message.member.roles.array()))
                        return;
                    
                    Phoenix.getCommandManager().handledCommand(message, server, user);
                    server.getLevelModule().giveMessageXp(message, user);
                }
            }
        });
        /* todo send a text file with messages deleted.
                Phoenix.getClient().on('messageDeleteBulk', messages => {
                    messages = messages.filter(message => !message.author.bot && !['dm', 'voice', 'category', 'group'].includes(message.channel.type) && message.type === 'DEFAULT');
                    if (messages) {
                        let server = Phoenix.getServerManager().getOrCreateServer(messages.first().guild.id);
                        if (server instanceof Server) {/*
                            if (server.getPermissionsModule().hasPermission(message.first().member.roles.array(), RolePermissions.bypassLogger))
                                return;
                        
                            server.getLoggerModule().onMessageDeleted(message);
                        }
                    }
                });*/

        Phoenix.getClient().on('messageDelete', message => {
            if (message.author.bot || ['dm', 'voice', 'category', 'group'].includes(message.channel.type) || message.type !== 'DEFAULT')
                return;
            
            let server = Phoenix.getServerManager().getOrCreateServer(message.guild.id, message.guild);
            if (server instanceof Server) {
                if (server.getPermissionsModule().hasPermission(message.member.roles.array(), RolePermissions.bypassLogger))
                    return;
                
                if (!server.getPermissionsModule().hasPermission(message.member.roles.array(), RolePermissions.bypassLogger))
                    server.getLoggerModule().onMessageDeleted(message);
            }
        });
        
        Phoenix.getClient().on('messageUpdate', (oldMessage, newMessage) => {
            if (newMessage.author.bot || ['dm', 'voice', 'category', 'group'].includes(newMessage.channel.type) ||
                oldMessage.cleanContent == newMessage.cleanContent || newMessage.type !== 'DEFAULT')
                return;
            
            let user = Phoenix.getPhoenixUserManager().getOrCreateUser(newMessage.author.id, newMessage.author);
            if (user instanceof PhoenixUser) {
                let server = Phoenix.getServerManager().getOrCreateServer(newMessage.guild.id, newMessage.guild);
                if (server instanceof Server) {
                    if (server.getAutomodModule().messageFiltred(newMessage, newMessage.member.roles.array()))
                        return;
                        
                    if (!server.getPermissionsModule().hasPermission(newMessage.member.roles.array(), RolePermissions.bypassLogger))
                        server.getLoggerModule().onMessageUpdated(oldMessage, newMessage);
                    
                    if (Phoenix.getCommandManager().handledCommand(newMessage, server, user))
                        return;
                }
            }
        });

        Phoenix.getClient().on('guildMemberAdd', member => {
            if (member.user.bot)
                return;
            
            let server = Phoenix.getServerManager().getOrCreateServer(member.guild.id, member.guild);
            if (server instanceof Server) {
                server.getWelcomeModule().onMemberJoin(member);
                server.getCounterModule().updateCounters();
            }
        });

        Phoenix.getClient().on('guildMemberRemove', member => {
            if (member.user.bot)
                return;
            
            let server = Phoenix.getServerManager().getOrCreateServer(member.guild.id, member.guild);
            if (server instanceof Server) {
                server.getWelcomeModule().onMemberLeave(member);
                server.getCounterModule().updateCounters();
            }
        });

        Phoenix.getClient().on('channelCreate', channel => {
            if (channel instanceof GuildChannel) {
                let server = Phoenix.getServerManager().getOrCreateServer(channel.guild.id, channel.guild);
                server.getLoggerModule().onChannelCreated(channel);
            }
        });

        Phoenix.getClient().on('channelDelete', channel => {
            if (channel instanceof GuildChannel) {
                let server = Phoenix.getServerManager().getOrCreateServer(channel.guild.id, channel.guild);
                server.getLoggerModule().onChannelDeleted(channel);
            }
        });

        Phoenix.getClient().on('channelUpdate', async(oldChannel, newChannel) => {
            if (newChannel instanceof GuildChannel) {
                let changes = ''
                const auditLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 1 });
                const log = auditLogs.entries.first();
                for (const change of log.changes) {
                    const { key: _key, old: _old, new: _new } = change;
                    const type = _key.replace('name', 'Nome').replace('position', 'Posição')
                        .replace('topic', 'Tópico').replace('nsfw', 'NSFW?').replace('rate_limit_per_user', 'SlowMode')
                        .replace('bitrate', 'BitRate').replace('userLimit', 'Limite de Usuários');
                    const before = _old.replace('true', 'Sim').replace('false', 'Não').replace('undefined', 'Não Definido!');
                    const after = _new.replace('true', 'Sim').replace('false', 'Não');
                    changes += type + ':\nBefore: ' + before + ' -  After: ' + after + '\n\n';
                }
                let server = Phoenix.getServerManager().getOrCreateServer(newChannel.guild.id, newChannel.guild);
                server.getLoggerModule().onChannelUpdate(log, changes, newChannel);
            }
        });

        Phoenix.getClient().on('guildUpdate', async (oldGuild, newGuild) => {
            let changes = '';
            const auditLogs = await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE', limit: 1 });
            const log = auditLogs.entries.first();
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
                        let afterChannel = newGuild.channels.get(after);
                        let beforeChannel = newGuild.channels.get(before);
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
            let server = Phoenix.getServerManager().getOrCreateServer(newGuild.id, newGuild);
            server.getLoggerModule().onGuildUpdated(log, changes);
        });

    }

    public destroy() {
        
    }
}