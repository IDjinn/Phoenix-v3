import { Message, Guild, GuildMember, User, TextChannel,DMChannel, Client, MessageMentions, Role, GuildEmoji } from "discord.js";
import PhoenixUser from "./PhoenixUser";
import Server from "./Server";
import Constants from "../util/Constants";
/* TODO: DM CONTEXT
export class DMContext {
    public readonly message: Message;
    public readonly author: User;
    public readonly channel: DMChannel;
    public readonly client: Client;
    public readonly phoenixUser: PhoenixUser;
    constructor(message: Message, phoenixUser: PhoenixUser) {
        if (message.channel.type != 'dm')
            throw 'Invalid context';
        this.message = message;
        this.author = message.author;
        this.channel = message.channel as DMChannel;
        this.client = message.client;
        this.phoenixUser = phoenixUser;
    }

    protected t(key: string, ...args: any) {
        return this.phoenixUser.t(key, ...args);
    }
}*/

export class GuildContext{
    public readonly message: Message;
    public readonly guild: Guild;
    public readonly member: GuildMember;
    public readonly author: User;
    public readonly channel: TextChannel | DMChannel;
    public readonly phoenixUser: PhoenixUser;
    public readonly server: Server;
    public readonly me: GuildMember | null;
    public readonly client: Client;
    constructor(message: Message, phoenixUser: PhoenixUser, server: Server) {
        if (!message.guild || !message.member)
            throw 'Invalid context';
        
        this.message = message;
        this.guild = message.guild;
        this.member = message.member;
        this.author = message.author;
        this.channel = message.channel;
        this.phoenixUser = phoenixUser;
        this.server = server;
        this.client = message.client;
        this.me = this.guild.me;
    }

    public t(key: string, ...args: any) {
        return this.phoenixUser.t(key, ...args);
    }
}

export default class CommandContext extends GuildContext {
    /*private members: string[] = [];
    private channels: string[] = [];
    private roles: string[] = [];*/
    private args: string[] = [];
    
    constructor(message: Message, phoenixUser: PhoenixUser, server: Server) {
        super(message, phoenixUser, server);
        this.args = this.message.content.split(' ').slice(1);
    }

    public getMember(nullable = false, selfMember = false) {
        const regexArray = MessageMentions.USERS_PATTERN.exec(this.args[0]);
        const query = (regexArray && regexArray.length > 1 ? regexArray[1] : null) || this.args.shift()?.toLowerCase();

        if (!query && !nullable && selfMember)
            return this.member;
        else if (!query && !nullable) {
            throw this.t('command-error.missing-member-argument');
        }
        
        const member = this.guild.members.cache.get(query + '') || this.guild.members.cache.find(member => member.displayName == query) || selfMember ? this.member : null;
        if (!member && !nullable)
            throw this.t('command-error.member-not-found', query);
        return member! as GuildMember;
    }

    public getUser(nullable = false, crossServer = false, selfAuthor = false) {
        const regexArray = MessageMentions.USERS_PATTERN.exec(this.args[0]);
        const query = (regexArray && regexArray.length > 1 ? regexArray[1] : null) || this.args.shift()?.toLowerCase();

        if (!query && !nullable && selfAuthor)
            return this.author;
        else if (!query && !nullable)
            throw this.t('command-error.missing-user-argument');

        const user = this.guild.members.cache.get(query + '')?.user ||
            this.guild.members.cache.find(member => member.displayName == query)?.user ||
            crossServer ? (this.client.users.cache.get(query + '') || this.client.users.cache.find(user => user.username == query)) : null ||
                selfAuthor ? this.author : null;

        if (!user && !nullable)
            throw this.t('command-error.user-not-found', query);
        return user! as User;
    }

    public getChannel(nullable = false, selfChannel = false) {
        const regexArray = MessageMentions.CHANNELS_PATTERN.exec(this.args[0]);
        const query = (regexArray && regexArray.length > 1 ? regexArray[1] : null) || this.args.shift()?.toLowerCase();

        if (!query && !nullable && selfChannel)
            return this.channel;
        else if (!query && !nullable)
            throw this.t('command-error.missing-channel-argument');
        
        const channel = this.guild.channels.cache.get(query + '') || this.guild.channels.cache.find(channel => channel.name.toLowerCase() == query) || selfChannel ? this.message.channel : null;
        if (!channel && !nullable)
            throw this.t('command-error.channel-not-found', query);
        return channel! as TextChannel | DMChannel;
    }

    public getRole(nullable = false) {
        const regexArray = MessageMentions.ROLES_PATTERN.exec(this.args[0]);
        const query = (regexArray && regexArray.length > 1 ? regexArray[1] : null) || this.args.shift()?.toLowerCase();
        
        if (!query && !nullable)
            throw this.t('command-error.missing-role-argument');
        
        const role = this.guild.roles.cache.get(query + '') || this.guild.roles.cache.find(role => role.name.toLowerCase() == query);
        if (!role && !nullable)
            throw this.t('command-error.role-not-found', query);
        return role! as Role;
    }

    public getEmoji(nullable = false, crossServer = false) {
        const regexArray = Constants.EMOJIS_REGEX.exec(this.args[0])
        const query = (regexArray && regexArray.length > 1 ? regexArray[1].replace(':a:', '').replace(':', '') : null) || this.args.shift()?.toLowerCase();

        if (!query && !nullable)
            throw this.t('command-error.missing-emoji-argument');
        
        const emoji = this.guild.emojis.cache.get(query + '') ||
            this.guild.emojis.cache.find(emoji => emoji.name == query) ||
            crossServer ? (this.client.emojis.cache.get(query + '') || this.client.emojis.cache.find(emoji => emoji.name == query)) : null;
        
        if (!emoji && !nullable)
            throw this.t('command-error.emoji-not-found', query);
        return emoji! as GuildEmoji;
    }

    public async replyT(key: string, ...args: any) {
        if (this.channel.type == 'dm') {
            return await this.message.reply(this.t(key, ...args));
        }
        else if (this.me && this.channel.permissionsFor(this.me)?.has('SEND_MESSAGES')) {
            return await this.message.reply(this.t(key, ...args));
        }
        throw new Error(`I dont have permissions to talk here.
            Guild: ${this.guild.id}
            Channel: ${this.channel.id}
            Message: ${this.t(key, ...args)}`);
    }

    public async sendT(key: string, ...args: any) {
        if (this.channel.type == 'dm') {
            return await this.channel.send(this.t(key, ...args));
        }
        else if (this.me && this.channel.permissionsFor(this.me)?.has('SEND_MESSAGES')) {
            return await this.channel.send(this.t(key, ...args));
        }
        throw new Error(`I dont have permissions to talk here.
            Guild: ${this.guild.id}
            Channel: ${this.channel.id}
            Message: ${this.t(key, ...args)}`);
    }

    public shiftArgs() {
        return this.args.shift();
    }

    public argsLeft() {
        return this.args;
    }
}