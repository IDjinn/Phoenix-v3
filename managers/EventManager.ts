import AbstractManager from "../structures/AbstractManager";
import Phoenix from "../Phoenix";
import { Guild } from "discord.js";
import ServerSchema from "../schemas/ServerSchema";
import Server from "../structures/Server";

export default class EventManager extends AbstractManager{
    constructor() {
        super('EventManager');
    }
    public init() {
        Phoenix.getClient().on('guildCreate', async (guild: Guild) => {
            if (Phoenix.getServerManager().getServer(guild.id))
                return;
            /* PROVISORIO TODO
            Phoenix.getServerManager().createServer(await new ServerSchema({
                id: guild.id
            }).save());*/
        });
        Phoenix.getClient().on('message', message => {
            if (message.author.bot || ['dm', 'group'].includes(message.channel.type) || message.type !== 'DEFAULT')
                return;
            
            let server = Phoenix.getServerManager().getServer(message.guild.id);
            if (server instanceof Server) {
                Phoenix.getCommandManager().handledCommand(message, server);
            }
        });
    }
    public destroy() {
        
    }
}