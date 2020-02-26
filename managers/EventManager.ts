import AbstractManager from "../structures/AbstractManager";
import Phoenix from "../Phoenix";
import { Guild } from "discord.js";
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
                //todo: create server, it not found ?.
            }
            else
                Phoenix.getPhoenixUserManager().createUser(await new PhoenixUserSchema({ id: message.author.id }).save());
            //todo: create user, him not found.
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

        //todo chek if its working
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
                        server.getLoggerModule().onMessageUpdated(newMessage, newMessage);
                    
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
            }
        });

        Phoenix.getClient().on('guildMemberRemove', member => {
            if (member.user.bot)
                return;
            
            let server = Phoenix.getServerManager().getOrCreateServer(member.guild.id, member.guild);
            if (server instanceof Server) {
                server.getWelcomeModule().onMemberLeave(member);
            }
        });
    }

    public destroy() {
        
    }
}