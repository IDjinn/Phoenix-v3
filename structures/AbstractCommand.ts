import { GuildMember, PermissionResolvable, Message } from "discord.js";
import Server from "./Server";
import PhoenixUser from "./PhoenixUser";
import Constants from "../util/Constants";

export default abstract class AbstractCommand{
    public readonly name: string;
    public readonly description: string;
    public readonly aliases: string[];
    public readonly permissionsNeed: PermissionResolvable[];
    public readonly botPermissionsNeed: PermissionResolvable[];
    public readonly onlyOwner: boolean;
    public readonly enabled: boolean;

    constructor(props: ICommandProps) {
        this.name = props.name;
        this.description = props.description;
        this.aliases = props.aliases || [];
        this.permissionsNeed = props.permissionsNeed || [];
        this.botPermissionsNeed = props.botPermissionsNeed || [];
        this.onlyOwner = props.onlyOwner || false;
        this.enabled = props.enabled || true;
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
    public enabledForMemberId(id: string): boolean{
        return this.enabled || (this.onlyOwner && Constants.OWNERS_LIST.includes(id));
    }
}

export interface ICommandProps{
    name: string;
    description: string;
    aliases?: string[];
    permissionsNeed?: PermissionResolvable[];
    botPermissionsNeed?: PermissionResolvable[];
    onlyOwner?: boolean;
    enabled?: boolean;
}

export interface ICommandParameters{
    message: Message;
    args?: string[];
    server?: Server;
    phoenixUser?: PhoenixUser;
}