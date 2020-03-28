import AbstractCommand from "../structures/AbstractCommand";
import PingCommand from "../commands/others/Ping";
import { Message, Collection } from "discord.js";
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

export default class CommandController {
    private commands = new Collection<string, AbstractCommand>();
    private aliases = new Collection<string, string>();
    //private cooldown = new Map();
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
    }
    public destroy() {
        this.commands.clear();
        this.aliases.clear();
        //this.cooldown.clear(); 
    }

    public handledCommand(message: Message, server: Server, phoenixUser: PhoenixUser): boolean {
        if (!message.guild || !message.guild.me || !message.member || !server || !phoenixUser)
            return false;
        
        if (message.content.startsWith('> ')) //Ignore quotes
            return false;

        let usingPrefix = '';
        for (const thisPrefix of [server.prefix, Phoenix.getConfig().defaultPrefix, `<@!${message.guild.me.id}> `]) {
            if (message.content.startsWith(thisPrefix)) {
                usingPrefix = thisPrefix;
                break;
            }
        }

        if (!usingPrefix)
            return false;

        const args = message.content.slice(usingPrefix.length).split(' ');
        if (!args || !args[0])
            return false;
        
        const command = args.shift()!.toLowerCase();
        const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command) + '');
        if (cmd instanceof AbstractCommand) {
            //todo make it embeds and implements cooldown
            if (!cmd.enabledForMemberId(message.member.id))
                message.channel.send(phoenixUser.t('command-error.disabled')).catch();
            else if (!cmd.memberHasPermissions(message.member))
                message.channel.send(phoenixUser.t('command-error.missing-permissions')).catch();
            else if (!cmd.memberHasRolePermissions(message.member, server))
                message.channel.send(phoenixUser.t('command-error.missing-server-permissions')).catch();
            else if (!cmd.botHasPermissions(message.guild.me))
                message.channel.send(phoenixUser.t('command-error.missing-bot-permissions')).catch();
            else {
                try {
                    cmd.run({ message, args, server, phoenixUser });
                } catch (error) {
                    message.reply(phoenixUser.t('command-error.runtime-error', error)).catch();
                }
            }
        }

        return true;
    }

    public addCommand(command: AbstractCommand) {
        this.commands.set(command.name, command);
        if (command.aliases.length > 0) {
            command.aliases.forEach(aliase => {
                this.aliases.set(aliase, command.name);
            });
        }
    }

    public removeCommand(command: AbstractCommand): boolean {
        return this.commands.delete(command.name);
    }

    public getCommands(): Map<string, AbstractCommand> {
        return this.commands;
    }

    public getAliases(): Map<any, any> {
        return this.aliases;
    }
}