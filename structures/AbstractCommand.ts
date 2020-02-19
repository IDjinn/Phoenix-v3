import { GuildMember, PermissionResolvable, Snowflake, Message } from "discord.js";
import Server from "./Server";
import PhoenixUser from "./PhoenixUser";

export default abstract class AbstractCommand{
    public readonly name: string;
    public readonly description: string;
    public readonly aliases: string[];
    public readonly permissionsNeed: PermissionResolvable[];
    public readonly botPermissionsNeed: PermissionResolvable[];
    public readonly onlyOwner: boolean;
    public readonly enabled: boolean;

    constructor(name: string, description: string, aliases: string[], permissionsNeed: PermissionResolvable[], botPermissionsNeed: PermissionResolvable[], onlyOwner: boolean, enabled: boolean) {
        this.name = name;
        this.description = description;
        this.aliases = aliases;
        this.permissionsNeed = permissionsNeed;
        this.botPermissionsNeed = botPermissionsNeed;
        this.onlyOwner = onlyOwner;
        this.enabled = enabled;
    }

    public abstract run(params: ICommandParameters): void;
    public memberHasPermissions(member: GuildMember): boolean{
        if (this.permissionsNeed.length == 0)
            return true;
        return member.hasPermissions(this.permissionsNeed);
    }
    public botHasPermissions(member: GuildMember): boolean{
        return this.memberHasPermissions(member);
    }
    public enabledForMemberId(id: Snowflake): boolean{
        return this.enabled || (this.onlyOwner && id === '376460601909706773');
    }
}

export interface ICommandParameters{
    message: Message;
    args?: string[];
    server?: Server;
    phoenixUser?: PhoenixUser;
}