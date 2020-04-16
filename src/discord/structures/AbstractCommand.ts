import { GuildMember, PermissionResolvable, Message, GuildChannel } from "discord.js";
import Server from "./Server";
import PhoenixUser from "./PhoenixUser";
import Constants from "../util/Constants";
import PermissionsModule, { RolePermissions } from "../modules/PermissionsModule";

export default abstract class AbstractCommand {
    [x: string]: any;
    public readonly name: string;
    public readonly description: string;
    public readonly category: string;
    public readonly aliases: string[];
    public readonly cooldown: number;
    public readonly subCommands: ISubcommand[];
    public readonly permissionsNeed: PermissionResolvable[];
    public readonly botPermissionsNeed: PermissionResolvable[];
    public readonly rolePermissionsNeed: RolePermissions[];
    public readonly onlyOwner: boolean;
    public readonly enabled: boolean;

    constructor(props: ICommandProps) {
        this.name = props.name;
        this.category = props.category;
        this.description = `commands.${this.name}.description`;
        this.aliases = [];
        this.cooldown = props.cooldown || 4_000;
        this.subCommands = props.subCommands || [];
        this.permissionsNeed = props.permissionsNeed || [];
        this.botPermissionsNeed = props.botPermissionsNeed || [];
        this.rolePermissionsNeed = props.rolePermissionsNeed || [];
        this.onlyOwner = props.onlyOwner || false;
        this.enabled = props.enabled || true;
    }

    public abstract run(params: ICommandParameters): Promise<Message | Message[]> | Promise<void | any> | void;

    public memberHasPermissions(channel: GuildChannel, member: GuildMember): boolean {
        if (this.permissionsNeed.length == 0)
            return true;
        
        return member.permissionsIn(channel.id).has(this.permissionsNeed);
    }

    public botHasPermissions(channel: GuildChannel): boolean {
        if (!channel.guild || !channel.guild.me)
            return false;
        
        return this.memberHasPermissions(channel, channel.guild.me);
    }

    public memberHasRolePermissions(member: GuildMember, server: Server): boolean {
        if (!this.rolePermissionsNeed)
            return true;

        for (const rolePermission of this.rolePermissionsNeed) {
            if (!PermissionsModule.hasPermission(member.roles.cache.array(), server.getRoles(), rolePermission))
                return false;
        }
        return true;
    }

    public enabledForMemberId(id: string): boolean {
        return this.onlyOwner ? Constants.OWNERS_LIST.includes(id) : this.enabled;
    }
}

export interface ICommandProps {
    name: string;
    category: string;
    cooldown?: number;
    subCommands?: ISubcommand[];
    permissionsNeed?: PermissionResolvable[];
    botPermissionsNeed?: PermissionResolvable[];
    rolePermissionsNeed?: RolePermissions[];
    onlyOwner?: boolean;
    enabled?: boolean;
}

export interface ICommandParameters {
    message: Message;
    args: string[];
    server: Server;
    phoenixUser: PhoenixUser;
}

export interface ISubcommand{
    methodName: string;
    methodAliases?: string[];
}