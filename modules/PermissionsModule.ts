import AbstractModule from "../structures/AbstractModule";
import { Collection, Role } from "discord.js";
import Server from "../structures/Server";

export default class PermissionsModule extends AbstractModule {
    public readonly config: IRole[];
    private roles: Collection<string, IRole> = new Collection();
    constructor(data: IRole[], server: Server) {
        super('Permissions', server);
        this.config = data;
    }

    public init(): void {
        for (let role of this.config) {
            this.roles.set(role.id, role)
        }
    }

    public destroy(): void {
        this.roles.clear();
    }

    public hasPermission(roles: string[] | string, permission: RolePermissions): boolean {
        if (typeof roles === 'string')
            roles = [roles];
            for (let role of roles) {
            if (this.roles.has(role)) {
                if ((this.roles.get(role) as IRole).permissions.indexOf(permission) > -1)
                    return true;
            }
        }
        return false;
    }
}

export interface IRole {
    id: string;
    permissions: RolePermissions[];
}

export enum RolePermissions {
    sendLinks,
    sendInivites,
    canWarn,
    canWonXp,
    canAnnounce,
    canManageCurrency,
    bypassChannelCommand,
    bypassAutomod,
    bypassLogger,
    bypassXpChannels
}