import AbstractCommand, { CooldownType } from "../structures/AbstractCommand";
import PingCommand from "../commands/others/Ping";
import { Message, Collection, TextChannel } from "discord.js";
import Phoenix from "../Phoenix";
import Server from "../structures/Server";
import PhoenixUser from "../structures/PhoenixUser";
import KickCommand from "../commands/moderator/Kick";
import BanCommand from "../commands/moderator/Ban";
import BotinfoCommand from "../commands/others/Botinfo";
import AvatarCommand from "../commands/utils/Avatar";
import EvalCommand from "../commands/owner/Eval";
import WarnCommand from "../commands/moderator/Warn";
import CommandsCommand from "../commands/utils/Commands";
import LanguageCommand from "../commands/utils/Language";
import MuteCommand from "../commands/moderator/Mute";
import MassRoleCommand from "../commands/administrator/MassRole";
import IAmCommand from "../commands/fun/IAm";
import ClearCommand from "../commands/moderator/Clear";
import ReloadCommand from "../commands/owner/Reload";
import logger from "../util/logger/Logger";
import AsyncLock from 'async-lock';
import ConfigCommand from "../commands/administrator/Config";
import CommandContext from "../structures/CommandContext";
import Constants from "../util/Constants";

export default class CommandController {
    private commands = new Collection<string, AbstractCommand>();
    private aliases = new Collection<string, string>();
    private cooldown = new Collection<string, number>();
    private blacklist = new Set();
    private lock = new AsyncLock();
    public init() {
        this.addCommand(new PingCommand());
        this.addCommand(new KickCommand());
        this.addCommand(new BanCommand());
        this.addCommand(new BotinfoCommand());
        this.addCommand(new AvatarCommand());
        this.addCommand(new EvalCommand());
        this.addCommand(new WarnCommand());
        this.addCommand(new CommandsCommand());
        this.addCommand(new LanguageCommand());
        this.addCommand(new MuteCommand());
        this.addCommand(new MassRoleCommand());
        this.addCommand(new IAmCommand());
        this.addCommand(new ClearCommand());
        this.addCommand(new ReloadCommand());
        this.addCommand(new ConfigCommand());
    }
    public destroy() {
        this.commands.clear();
        this.aliases.clear();
    }

    public handledCommand(message: Message, server: Server, phoenixUser: PhoenixUser): boolean {
        if (!message.guild || !message.guild.me || !message.member || !server || !phoenixUser)
            return false;

        if (this.lock.isBusy(message.author.id)) //User already executing one command.
            return false;

        if (message.content.startsWith('> ')) //Ignore quotes
            return false;

        if (!message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES'))
            return false; // If i cannot have permissions to sent message, i do not process commands

        let usingPrefix = null;
        for (const thisPrefix of [server.prefix, Phoenix.getConfig().defaultPrefix, `<@!${message.guild.me.id}> `]) {
            if (message.content.startsWith(thisPrefix)) {
                usingPrefix = thisPrefix;
                break;
            }
        }

        if (!usingPrefix)
            return false;
        /*
        if (server.commands.enabled) { //todo: remake this logic
            if ((server.commands.blacklist.includes(message.channel.id) && !PermissionsModule.hasPermission(message.member.roles.cache.array(), server.getRoles(),
                RolePermissions.bypassChannelCommand)) || (!server.commands.whitelist.includes(message.channel.id)) && server.commands.whitelist.length > 0) {
                return false;
            }
        }*/

        const args = message.content.slice(usingPrefix.length).split(' ');
        if (args.length === 0)
            return false;

        const command = args.shift()!.toLowerCase();
        const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command) + '');
        if (cmd instanceof AbstractCommand) {
            const ctx = new CommandContext(message, phoenixUser, server);
            this.lock.acquire(message.author.id, async () => {
                if (await this.needAwaitCooldown(ctx, cmd.cooldownType))
                    return false;
                else if (!cmd.enabledForContext(ctx.author.id))
                    await ctx.replyT('command-error.disabled');
                else if (!cmd.memberHasPermissions(ctx.channel as TextChannel, ctx.member))
                    await ctx.replyT('command-error.missing-permissions');
                else if (!cmd.memberHasRolePermissions(ctx.member, server))
                    await ctx.replyT('command-error.missing-server-permissions');
                else if (!cmd.botHasPermissions(ctx.channel as TextChannel))
                    await ctx.replyT('command-error.missing-bot-permissions');
                else {
                    try {
                        if (cmd.subCommands.length > 0 && args.length > 0) {
                            const subCommand = args[0].toLowerCase();
                            const subCommandsMethods = cmd.subCommands.filter(command => command.methodName.toLowerCase() === subCommand || (command.methodAliases ? command.methodAliases.includes(subCommand) : false));
                            if (subCommandsMethods.length > 0 && typeof cmd[subCommandsMethods[0].methodName] === 'function') {
                                await cmd[subCommandsMethods[0].methodName]({ message, args: args.slice(1), server, phoenixUser, ctx });
                                return true;
                            }
                        }
                        await cmd.run({ message, args, server, phoenixUser, ctx });
                        return true;
                    } catch (error) {
                        await ctx.replyT('command-error.runtime-error', error);
                        logger.error('Command runtime error: ', error);
                        console.error(error);
                    }
                }
                return false;
            });
        }
        return false;
    }

    private async needAwaitCooldown(ctx: CommandContext, cooldownType: CooldownType) {
        if (Constants.OWNERS_LIST.includes(ctx.author.id))
            return false; // Owners not need await cooldowns.

        let awaiterID;
        switch (cooldownType) {
            case 'AUTHOR':
                awaiterID = ctx.author.id;
                break;
            case 'CHANNEL':
                awaiterID = ctx.channel.id;
                break;
            case 'GUILD':
                awaiterID = ctx.guild.id;
                break;
            case 'CLIENT':
                awaiterID = ctx.client.user!.id;
        }
        const cooldown = this.cooldown.get(awaiterID);
        const cooldownTime = cooldown ? (cooldown - Date.now()) : 0;
        if (cooldownTime <= 0) {
            this.blacklist.delete(awaiterID);
            this.cooldown.delete(awaiterID);
            return false;
        }

        if (!this.blacklist.has(awaiterID)) {
            // TODO: convert seconds to moment date. moment(cooldownTime).format('DD/');
            await ctx.replyT(`command-error.await-cooldown.${cooldownType.toLowerCase()}`, (cooldownTime / 1000).toFixed(1) + 's');
            this.blacklist.add(awaiterID);
        }
        return true;
    }

    public addCommand(command: AbstractCommand) {
        this.commands.set(command.name, command);
        const aliases = Phoenix.getTextController().allT(`commands.${command.name}.name`);
        aliases.forEach(aliase => {
            if (aliase !== command.name)
                this.aliases.set(aliase.toLowerCase(), command.name);
        });
    }

    public removeCommand(command: AbstractCommand): boolean {
        return this.commands.delete(command.name);
    }

    public getCommands(): Collection<string, AbstractCommand> {
        return this.commands;
    }

    public getAliases(): Collection<string, string> {
        return this.aliases;
    }
}

export interface ICommands {
    enabled: boolean;
    whitelist: string[];
    blacklist: string[];
}