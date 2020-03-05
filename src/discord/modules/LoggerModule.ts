import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";
import { Message, TextChannel, RichEmbed, GuildChannel, Role, NewsChannel } from "discord.js";
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

    private sendEmbed(embed: RichEmbed) {
        let channel = this.getServer().getGuild().channels.get(this.config.logChannelId);
        if (channel instanceof TextChannel || channel instanceof NewsChannel) {
            channel.send(embed).catch();
        }
    }

    public onMessageUpdated(oldMessage: Message, newMessage: Message) {
        if (this.config.messageUpdatedEnabled) {
            this.sendEmbed(EmbedWithTitle('Message Updated', `Old content: \`\`\`${oldMessage.cleanContent}\`\`\`\n\nNew Content: \`\`\`${newMessage.cleanContent}\`\`\``));
        }
    }

    public onMessageDeleted(message: Message) {
        if (this.config.messageDeletedEnabled) {
            this.sendEmbed(EmbedWithTitle('Message Deleted', `Content: \`\`\`${message.cleanContent}\`\`\``));
        }
    }

    public onChannelCreated(channel: GuildChannel) {
        if (this.config.channelCreatedEnabled) {
            this.sendEmbed(EmbedWithTitle('Channel Created', `Channel name: \`${channel.name}\`\nChannel Id: \`${channel.id}\`\nChannel mention: ${channel.toString()}`));
        }
    }

    public onChannelDeleted(channel: GuildChannel) {
        if (this.config.channelDeletedEnabled) {
            this.sendEmbed(EmbedWithTitle('Channel Deleted', `Channel name: \`${channel.name}\`\nChannel Id: \`${channel.id}\``));
        }
    }

    public onRoleCreated(role: Role) {
        if (this.config.roleCreatedEnabled) {
            this.sendEmbed(EmbedWithTitle('Role Created', `Role name: \`${role.name}\`\nRole Id: \`${role.id}\`\nRole mention: ${role.toString()}`))
        }
    }

    public onRoleDeleted(role: Role) {
        if (this.config.roleDeletedEnabled) {
            this.sendEmbed(EmbedWithTitle('Role Deleted', `Role name: \`${role.name}\`\nRole Id: \`${role.id}\``))
        }
    }

    public onGuildUpdated(log: any, changed: string) {
        if (this.config.guildUpdatedEnabled) {
            this.sendEmbed(EmbedWithTitle('Guild Config Updated',`Updated by: ${log.executor.username}\nUpdates: \`${changed.trim()}\`\nTag: ${log.executor.username + "#" + log.executor.discriminator}\nMention: <@${log.executor.id}>`))
        }
    }

    public onChannelUpdate(log: any, changed: string, channel: GuildChannel) {
        if (this.config.channelUpdatedEnabled) {
            this.sendEmbed(EmbedWithTitle('Channel Updated', `Name: ${channel.name}\nUpdated by: <@${log.executor.id}>\nMention: <#${channel.id}>\n\nUpdates: \`${changed.trim()}\``))
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