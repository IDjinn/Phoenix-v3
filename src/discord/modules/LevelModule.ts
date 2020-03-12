import Server from "../structures/Server";
import { Message, TextChannel, NewsChannel } from "discord.js";
import PhoenixUser from "../structures/PhoenixUser";
import Constants from "../util/Constants";
import PermissionsModule, { RolePermissions } from "./PermissionsModule";
import { SimpleEmbed } from "../util/EmbedFactory";

export default class LevelModule {
    public static giveMessageXp(server: Server, message: Message, user: PhoenixUser) {
        if (!server.getLevel().enabled || !user || message.cleanContent.length <= 5)
            return;

        if (!PermissionsModule.hasPermission(message.member.roles.array(), server.getRoles(), RolePermissions.canWonXp))
            return;

        if (!server.getLevel().whitelist.includes(message.channel.id))
            return;

        if (server.getLevel().blacklist.includes(message.channel.id) &&
            !PermissionsModule.hasPermission(message.member.roles.array(), server.getRoles(), RolePermissions.bypassXpChannels))
            return;

        let currentILevel = server.getLevel().levels.find(x => x.level === user.getLevel());
        //server multiplier === donator server, more xp per message? todo this. (max xp p/ message ~ 15?)
        const winXp = Math.floor(Math.random() * 3 + 1) * user.getXpMultiplier() *
            (currentILevel ? currentILevel.xpMultiplier * server.getLevel().serverXpMultiplier : server.getLevel().serverXpMultiplier);
        user.setXp(user.getXp() + winXp);
        if (user.getXp() > Constants.getXpFromLevel(user.getLevel() + 1)) {
            user.setLevel(user.getLevel() + 1);
            const newILevel = server.getLevel().levels.find(x => x.level === user.getLevel());
            if (newILevel) {
                message.member.addRoles(newILevel.giveRoles).catch();
                message.member.removeRoles(newILevel.takeRoles).catch();
            }
            const channel = message.guild.channels.get(server.getLevel().channel);
            if (channel instanceof TextChannel || channel instanceof NewsChannel)
                channel.send(SimpleEmbed(server.t('level-up-message', message.member, user.getLevel())));
        }
    }
}

export interface ILevelModule {
    enabled: boolean;
    serverXpMultiplier: number;
    channel: string;
    whitelist: string[];
    blacklist: string[];
    levels: ILevel[];
}

export interface ILevel {
    level: number;
    giveRoles: string[];
    takeRoles: string[];
    xpMultiplier: number;
}