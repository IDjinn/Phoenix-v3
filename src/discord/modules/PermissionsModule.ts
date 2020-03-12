import { Role } from "discord.js";
import { isArray } from "util";

export default class PermissionsModule {
    public static hasPermission(roles: Role[], iRoles: IRole[] | undefined, permission: RolePermissions): boolean {
        if (isArray(iRoles)) {
            for (const role of roles) {
                const iRole = iRoles.find(r => r.id === role.id);
                if (iRole && iRole.permissions.indexOf(permission) >= 0)
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
    bypassXpChannels,
    ignoreDupChars,
    ignoreCapsLock,
    ignoreMassMention
}