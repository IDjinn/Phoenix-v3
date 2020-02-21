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
        Phoenix.getClient().on('guildCreate', async (guild: Guild) => {
            if (Phoenix.getServerManager().getServer(guild.id))
                return;
            /* TODO create server in database
            Phoenix.getServerManager().createServer(await new ServerSchema({
                id: guild.id
            }).save());*/
        });

        Phoenix.getClient().on('message', async message => {
            if (message.author.bot || ['dm', 'group'].includes(message.channel.type) || message.type !== 'DEFAULT')
                return;
            
            let user = Phoenix.getPhoenixUserManager().getUser(message.author.id);
            if (user instanceof PhoenixUser) {
                let server = Phoenix.getServerManager().getServer(message.guild.id);
                if (server instanceof Server) {
                    if (server.getAutomodModule().messageFiltred(message, message.member.roles.map(role => role.id)))
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

        Phoenix.getClient().on('messageDelete', message => {
            if (message.author.bot || ['dm', 'group'].includes(message.channel.type) || message.type !== 'DEFAULT')
                return;
            
            let server = Phoenix.getServerManager().getServer(message.guild.id);
            if (server instanceof Server) {
                if (server.getPermissionsModule().hasPermission(message.member.roles.map(role => role.id), RolePermissions.bypassLogger))
                    return;
                
                server.getLoggerModule().onMessageDeleted(message);
            }
        });

        Phoenix.getClient().on('messageUpdate', (oldMessage, newMessage) => {
            if (oldMessage.author.bot || ['dm', 'group'].includes(oldMessage.channel.type) ||
                oldMessage.cleanContent === newMessage.cleanContent || oldMessage.type !== 'DEFAULT' ||
                !newMessage.cleanContent)
                return;
            
            let user = Phoenix.getPhoenixUserManager().getUser(newMessage.author.id);
            if (user instanceof PhoenixUser) {
                let server = Phoenix.getServerManager().getServer(newMessage.guild.id);
                if (server instanceof Server) {
                    if (server.getAutomodModule().messageFiltred(newMessage, newMessage.member.roles.map(role => role.id)))
                        return;
                        
                    Phoenix.getCommandManager().handledCommand(newMessage, server, user);
                    if (!server.getPermissionsModule().hasPermission(newMessage.member.roles.map(role => role.id), RolePermissions.bypassLogger))
                        server.getLoggerModule().onMessageUpdated(newMessage, newMessage);
                }
                //todo: create server, it not found ?.
            }
           /* else
                //Phoenix.getPhoenixUserManager().createUser(await new PhoenixUserSchema({ id: message.author.id }).save());
            //todo: create user, him not found.*/
        });
    }

    public destroy() {
        
    }
}