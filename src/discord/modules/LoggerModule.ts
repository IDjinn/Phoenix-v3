import Server from "../structures/Server";
import { Message, TextChannel, GuildChannel, Role, NewsChannel, MessageEmbed } from "discord.js";
import { EmbedWithTitle } from "../util/EmbedFactory";

export default class LoggerModule {
    private static sendEmbed(server: Server, embed: MessageEmbed) {
        let channel = server.getGuild().channels.cache.get(server.getLogger().logChannelId);
        if (channel instanceof TextChannel || channel instanceof NewsChannel) {
            channel.send(embed).catch();
        }
    }

    public static onMessageUpdated(server: Server, oldMessage: Message, newMessage: Message) {
        if (server.getLogger().messageUpdatedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Message Updated', `Old content: \`\`\`${oldMessage.cleanContent}\`\`\`\n\nNew Content: \`\`\`${newMessage.cleanContent}\`\`\``));
        }
    }

    public static onMessageDeleted(server: Server, message: Message) {
        if (server.getLogger().messageDeletedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Message Deleted', `Content: \`\`\`${message.cleanContent}\`\`\``));
        }
    }

    public static onChannelCreated(server: Server, channel: GuildChannel) {
        if (server.getLogger().channelCreatedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Channel Created', `Channel name: \`${channel.name}\`\nChannel Id: \`${channel.id}\`\nChannel mention: ${channel.toString()}`));
        }
    }

    public static onChannelDeleted(server: Server, channel: GuildChannel) {
        if (server.getLogger().channelDeletedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Channel Deleted', `Channel name: \`${channel.name}\`\nChannel Id: \`${channel.id}\``));
        }
    }

    public static onRoleCreated(server: Server, role: Role) {
        if (server.getLogger().roleCreatedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Role Created', `Role name: \`${role.name}\`\nRole Id: \`${role.id}\`\nRole mention: ${role.toString()}`))
        }
    }

    public static onRoleDeleted(server: Server, role: Role) {
        if (server.getLogger().roleDeletedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Role Deleted', `Role name: \`${role.name}\`\nRole Id: \`${role.id}\``))
        }
    }

    public static onGuildUpdated(server: Server, log: any, changed: string) {
        if (server.getLogger().guildUpdatedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Guild Config Updated', `Updated by: ${log.executor.username}\nUpdates: \`${changed.trim()}\`\nTag: ${log.executor.username + "#" + log.executor.discriminator}\nMention: <@${log.executor.id}>`))
        }
    }

    public static onChannelUpdate(server: Server, log: any, changed: string, channel: GuildChannel) {
        if (server.getLogger().channelUpdatedEnabled) {
            this.sendEmbed(server, EmbedWithTitle('Channel Updated', `Name: ${channel.name}\nUpdated by: <@${log.executor.id}>\nMention: <#${channel.id}>\n\nUpdates: \`${changed.trim()}\``))
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