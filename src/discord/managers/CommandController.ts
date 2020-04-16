import AbstractCommand from "../structures/AbstractCommand";
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
//import PermissionsModule, { RolePermissions } from "../modules/PermissionsModule";
import ReloadCommand from "../commands/owner/Reload";
import logger from "../util/logger/Logger";
import AsyncLock from 'async-lock';

export default class CommandController {
    private commands = new Collection<string, AbstractCommand>();
    private aliases = new Collection<string, string>();
    //private cooldown =new Collection<string, number>();
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
    }
    public destroy() {
        this.commands.clear();
        this.aliases.clear();
    }

    public handledCommand(message: Message, server: Server, phoenixUser: PhoenixUser): boolean {
        if (!message.guild || !message.guild.me || !message.member || !server || !phoenixUser)
            return false;
        
        if (message.content.startsWith('> ')) //Ignore quotes
            return false;
        
        if (!message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES'))
            return false; // If i cannot have permissions to sent message, i do not process commands

        let usingPrefix = '';
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
        const command = args.shift()!.toLowerCase();
        const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command) + '');
        if (cmd instanceof AbstractCommand) {/*
            const cooldown = this.cooldown.get(message.author.id);
            const cooldownTime = cooldown ? (cooldown - Date.now()) : 0;
            if (cooldownTime > 0)
                message.reply('You are in cooldown, need await ' + cooldownTime + 'ms');
            //todo implements cooldown*/
            if (!cmd.enabledForMemberId(message.member.id))
                message.channel.send(phoenixUser.t('command-error.disabled')).catch();
            else if (!cmd.memberHasPermissions(message.channel as TextChannel, message.member))
                message.channel.send(phoenixUser.t('command-error.missing-permissions')).catch();
            else if (!cmd.memberHasRolePermissions(message.member, server))
                message.channel.send(phoenixUser.t('command-error.missing-server-permissions')).catch();
            else if (!cmd.botHasPermissions(message.channel as TextChannel))
                message.channel.send(phoenixUser.t('command-error.missing-bot-permissions')).catch();
            else if (this.lock.isBusy(message.author.id)) //User already executing one command.
                return false;
            else {
                try {
                    if (cmd.subCommands.length > 0) {
                        const subCommandsMethods = cmd.subCommands.filter(command => command.methodName === args[0] || (command.methodAliases ? command.methodAliases.includes(args[0]) : false));
                        if (subCommandsMethods.length > 0) {
                            this.lock.acquire(message.author.id, cmd[subCommandsMethods[0].methodName]({ message, args: args.slice(1), server, phoenixUser }));
                            return true;
                        }
                    }
                    this.lock.acquire(message.author.id, async () => cmd.run({ message, args, server, phoenixUser }));
                    //this.cooldown.set(message.author.id, Date.now() + 3_500);
                    return true;
                } catch (error) {
                    message.reply(phoenixUser.t('command-error.runtime-error', error)).catch();
                    logger.error('Command runtime error', error);
                }
            }
        }
        return true;
    }

    public addCommand(command: AbstractCommand) {
        this.commands.set(command.name.toLowerCase(), command);
        const aliases = Phoenix.getTextController().allT(`commands.${command.name}.name`);
        if (aliases.length > 0) {
            aliases.forEach(aliase => {
                if (aliase !== command.name)
                    this.aliases.set(aliase.toLowerCase(), command.name.toLowerCase());
            });
        }
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

export interface ICommands{
    enabled: boolean;
    whitelist: string[];
    blacklist: string[];
}