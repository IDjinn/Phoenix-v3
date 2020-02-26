import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";
import { GuildMember, TextChannel, Collection } from "discord.js";

export default class WelcomeModule extends AbstractModule{
    public config: IWelcome;
    private doorLog = new Collection<string, string>(); //todo make anti raid with this
    constructor(data: IWelcome, server: Server) {
        super('Welcome', server);
        this.config = data;
    }
    public init(): void {
        
    }
    public destroy(): void {
        this.doorLog.clear();
    }

    public onMemberJoin(member: GuildMember) {
        if (this.config.join.enabled) {
            let channel = member.guild.channels.get(this.config.join.channel);
            if (channel instanceof TextChannel)
                channel.send(this.config.join.embed).catch();
            if (this.config.autorole.enabled)
                member.addRoles(this.config.autorole.roles).catch();
        }
        this.doorLog.set(Date.now().toString(), member.id);
    }

    public onMemberLeave(member: GuildMember) {
        if (this.config.leave.enabled) {
            let channel = member.guild.channels.get(this.config.leave.channel);
            if (channel instanceof TextChannel)
                channel.send(this.config.leave.embed).catch();
        }
        this.doorLog.set(Date.now().toString(), member.id);
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