import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";

export default class LoggerModule extends AbstractModule{
    public readonly config: any;
    constructor(data: ILogger, server: Server){
        super('LoggerModule', server);
        this.config = data;
    }
    public init() {
        
    }
    public destroy() {
        
    }
}

export interface ILogger{
    logger: {
        messageDeleted: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        messageUpdated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        guildUpdated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        roleUpdated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        roleCreated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        roleDeleted: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        memberUpdated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        channelCreated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        channelUpdated: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        channelDeleted: {
            enabled: boolean
            channel: string
            embed: JSON
        },
    }
}