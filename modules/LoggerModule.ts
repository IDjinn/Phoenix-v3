import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";
import { Message, GuildAuditLogsAction, Guild, GuildAuditLogs, TextChannel, StoreChannel, NewsChannel, RichEmbed } from "discord.js";
import { EmbedWithTitle } from "../util/EmbedFactory";

export default class LoggerModule extends AbstractModule {
    public readonly config: ILogger;
    constructor(data: ILogger, server: Server) {
        super('LoggerModule', server);
        this.config = data;
    }

    public init() {
        
    }

    public destroy() {
        
    }
/* todo: make this
    private async fechAuditLog(type: GuildAuditLogsAction, guild: Guild) {
        return await guild.fetchAuditLogs({ type, limit: 1 });
    }*/

    private sendEmbed(embed: RichEmbed) {
        let channel = this.getServer().getGuild().channels.get(this.config.logChannelId);
        if (channel instanceof TextChannel)
            channel.send({ embed }).catch();
    }

    public onMessageUpdated(oldMessage: Message, newMessage: Message) {
        if (this.config.messageDeletedEnabled) {
            this.sendEmbed(new EmbedWithTitle('Message Updated', `Old content: \`\`\`${oldMessage.cleanContent}\`\`\`\n\nNew Content: \`\`\`${newMessage.cleanContent}\`\`\``));
        }
    }

    public onMessageDeleted(message: Message) {
        if (this.config.messageDeletedEnabled) {
            this.sendEmbed(new EmbedWithTitle('Message Deleted', `Content: \`\`\`${message.cleanContent}\`\`\``));
        }
    }
}

export interface ILogger {
    logChannelId: string;
    messageDeletedEnabled: boolean;
    messageUpdatedEnabled: boolean;
    guildUpdatedEnabled: boolean;
    roleUpdatedEnabled: boolean;
    roleCreatedEnabled: boolean;
    roleDeletedEnabled: boolean;
    memberUpdatedEnabled: boolean;
    channelCreatedEnabled: boolean;
    channelUpdatedEnabled: boolean;
    channelDeletedEnabled: boolean;
}