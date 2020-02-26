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
        for (let i in this.config.levels || []) {
            this.levels.set(this.config.levels[i].level, this.config.levels[i]);
        }
    }
    public destroy(): void {

    }
    
    public giveMessageXp(message: Message, user: PhoenixUser) {
        if (!this.config.enabled || message.cleanContent.length <= 5 || !user ||
            !this.getServer().getPermissionsModule().hasPermission(
                message.member.roles.array(), RolePermissions.canWonXp))
            return;
        
        if (!this.config.whitelist.includes(message.channel.id))
            return;

        if (this.config.blacklist.includes(message.channel.id) &&
            !this.getServer().getPermissionsModule().hasPermission(message.member.roles.array(),
                RolePermissions.bypassXpChannels))
            return;
        
        let currentILevel = this.levels.get(user.getLevel());
        //server multiplier === donator server, more xp per message? todo this. (max xp p/ message ~ 15?)
        const winXp = Math.floor(Math.random() * 3 + 1) * user.getXpMultiplier() *
            (currentILevel ? currentILevel.xpMultiplier * this.config.serverXpMultiplier : this.config.serverXpMultiplier);
        user.setXp(user.getXp() + winXp, true);
        if (user.getXp() > Constants.getXpFromLevel(user.getLevel() + 1)) {
            //todo user level up
            user.setLevel(user.getLevel() + 1, true);
            let newILevel = this.levels.get(user.getLevel());
            if (newILevel) {
                message.member.addRoles(newILevel.giveRoles).catch();
                message.member.removeRoles(newILevel.takeRoles).catch();
            }
            message.channel.send(`you've level up ` + user.getLevel());
        }
    }
}

export interface ILevelModule{
    enabled: boolean;
    serverXpMultiplier: number;
    channel: string;
    whitelist: string[];
    blacklist: string[];
    levels: ILevel[];
    embed: JSON;
}

export interface ILevel{
    level: number;
    giveRoles: string[];
    takeRoles: string[];
    xpMultiplier: number;
}