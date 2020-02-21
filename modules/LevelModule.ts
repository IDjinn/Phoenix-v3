import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";
import { Message } from "discord.js";
import PhoenixUser from "../structures/PhoenixUser";
import Constants from "../util/Constants";
import { Collection } from "discord.js";
import { RolePermissions } from "./PermissionsModule";

export default class LevelModule extends AbstractModule{
    public config: ILevelModule;
    private levels: Collection<number, ILevel> = new Collection();
    constructor(data: ILevelModule, server: Server) {
        super('Level', server);
        this.config = data;
    }
    public init(): void {
        for (let i in this.config.levels) {
            this.levels.set(this.config.levels[i].level, this.config.levels[i]);
        }
    }
    public destroy(): void {

    }
    
    public giveMessageXp(message: Message, user: PhoenixUser) {
        if (message.cleanContent.length <= 5 || !user ||
            !this.getServer().getPermissionsModule().hasPermission(
                message.member.roles.map(role => role.id), RolePermissions.canWonXp))
            return;
        
        if (!this.config.whitelist.includes(message.channel.id))
            return;

        if (this.config.blacklist.includes(message.channel.id) &&
            !this.getServer().getPermissionsModule().hasPermission(message.member.roles.map(role => role.id),
                RolePermissions.bypassXpChannels))
            return;
        
        let iLevel = this.levels.get(user.getLevel());
        const winXp = Math.floor(Math.random() * 3 + 1) * (iLevel ? iLevel.xpMultiplier * this.config.serverXpMultiplier : this.config.serverXpMultiplier);
        user.setXp(user.getXp() + winXp, true);
        if (user.getXp() > Constants.getXpFromLevel(user.getLevel() + 1)) {
            //todo user level up
            user.setLevel(user.getLevel() + 1, true);
            iLevel = this.levels.get(user.getLevel());
            if (iLevel) {
                message.member.addRoles(iLevel.giveRoles).catch();
                message.member.removeRoles(iLevel.takeRoles).catch();
            }
            message.channel.send(`you've level up ` + user.getLevel());
        }
    }
}

export interface ILevelModule{
    serverXpMultiplier: number;
    whitelist: string[];
    blacklist: string[];
    levels: ILevel[];
}

export interface ILevel{
    level: number;
    giveRoles: string[];
    takeRoles: string[];
    xpMultiplier: number;
}