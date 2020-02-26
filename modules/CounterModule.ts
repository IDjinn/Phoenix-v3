import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";

export default class CounterModule extends AbstractModule {
    public config: ICounter;
    constructor(data: ICounter, server: Server) {
        super('Counter', server);
        this.config = data;
    }
    
    public init(): void {
        this.updateCounter(this.config.users.channel, this.config.users.name.replace(/{users}/gi, this.getServer().getGuild().memberCount.toString()))
        this.updateCounter(this.config.bots.channel, this.config.bots.name.replace(/{bots}/gi, this.getServer().getGuild().members.filter(member => member.user.bot).size.toString()))
        this.updateCounter(this.config.channels.channel, this.config.channels.name.replace(/{channels}/gi, this.getServer().getGuild().channels.size.toString()))
    }

    public destroy(): void {
        
    }

    private updateCounter(id: string, name: string) {
        let channel = this.getServer().getGuild().channels.get(id);
        if (channel)
            channel.setName(name).catch();
    }
}

export interface ICounter{
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