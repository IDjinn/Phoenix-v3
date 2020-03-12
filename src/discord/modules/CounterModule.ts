import Server from "../structures/Server";
import { Guild } from "discord.js";

export default class CounterModule {
    public static updateCounters(server: Server) {
        if (server.getCounter().users.enabled)
            this.updateChannelName(server.getCounter().users.channel, server.getCounter().users.name.replace(/{users}/gi, server.getGuild().memberCount.toString()), server.getGuild());
        if (server.getCounter().bots.enabled)
            this.updateChannelName(server.getCounter().bots.channel, server.getCounter().bots.name.replace(/{bots}/gi, server.getGuild().members.filter(member => member.user.bot).size.toString()), server.getGuild());
        if (server.getCounter().channels.enabled)
            this.updateChannelName(server.getCounter().channels.channel, server.getCounter().channels.name.replace(/{channels}/gi, server.getGuild().channels.size.toString()), server.getGuild());
    }

    private static updateChannelName(id: string, name: string, guild: Guild) {
        let channel = guild.channels.get(id);
        if (channel && channel.name !== name)
            channel.setName(name).catch();
    }
}

export interface ICounter {
    users: {
        enabled: boolean
        channel: string
        name: string
    },
    bots: {
        enabled: boolean
        channel: string
        name: string
    },
    channels: {
        enabled: boolean
        channel: string
        name: string
    }
}