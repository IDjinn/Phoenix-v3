import Server from "../structures/Server";
import { GuildMember, TextChannel } from "discord.js";
import { EmbedWithTitle } from "../util/EmbedFactory";

export default class WelcomeModule {
    //private doorLog = new Collection<string, string>(); //todo make anti raid with this
    public static onMemberJoin(server: Server, member: GuildMember) {
        if (server.getWelcome().join.enabled) {
            let channel = member.guild.channels.cache.get(server.getWelcome().join.channel);
            if (channel instanceof TextChannel) {
                if (server.getWelcome().join.embed)
                    channel.send(server.getWelcome().join.embed).catch();
                else
                    channel.send(EmbedWithTitle('User Joined', `The user ${member.toString()} joined in the ${member.guild.name} server.`)).catch();
            }
            if (server.getWelcome().autorole.enabled)
                member.roles.add(server.getWelcome().autorole.roles).catch();
        }
    }

    public static onMemberLeave(server: Server, member: GuildMember) {
        if (server.getWelcome().leave.enabled) {
            let channel = member.guild.channels.cache.get(server.getWelcome().leave.channel);
            if (channel instanceof TextChannel) {
                if (server.getWelcome().leave.embed)
                    channel.send(server.getWelcome().leave.embed).catch();
                else
                    channel.send(EmbedWithTitle('User Leave', `The user ${member.toString()} leaved in the ${member.guild.name} server.`)).catch();
            }
        }
    }
}

export interface IWelcome {
    join: {
        enabled: boolean
        channel: string
        embed: JSON
    },
    leave: {
        enabled: boolean
        channel: string
        embed: JSON
    },
    autorole: {
        enabled: boolean
        roles: string[]
    },
}