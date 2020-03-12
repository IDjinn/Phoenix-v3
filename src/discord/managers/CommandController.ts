import AbstractCommand from "../structures/AbstractCommand";
import PingCommand from "../commands/others/Ping";
import { Message } from "discord.js";
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

export default class CommandController {
    private commands = new Map();
    private aliases = new Map();
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
    }
    public destroy() {
        this.commands.clear();
        this.aliases.clear();
        //this.cooldown.clear(); 
    }

    public handledCommand(message: Message, server: Server, phoenixUser: PhoenixUser): boolean {
        let prefix = '';
        for (const thisPrefix of [server.prefix, Phoenix.getConfig().defaultPrefix, `<@!${message.guild.me.id}> `]) {
            if (message.content.startsWith(thisPrefix)) {
                prefix = thisPrefix;
                break;
            }
        }

        if (!prefix)
            return false;

        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift()!.toLowerCase();
        const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command));
        if (cmd instanceof AbstractCommand) {
            const t = phoenixUser.t;
            //todo make it embeds and implements cooldown
            if (!cmd.enabledForMemberId(message.member.id))
                message.channel.send(t('command-error.disabled')).catch();
            else if (!cmd.memberHasPermissions(message.member))
                message.channel.send(t('command-error.missing-permissions')).catch();
            else if (!cmd.memberHasRolePermissions(message.member, server))
                message.channel.send(t('command-error.missing-server-permissions')).catch();
            else if (!cmd.botHasPermissions(message.guild.me))
                message.channel.send(t('command-error.missing-bot-permissions')).catch();
            else {
                try {
                    cmd.run({ message, args, server, phoenixUser, t });
                } catch (error) {
                    message.reply(t('command-error.runtime-error', error));
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

    public getCommands(): Map<any, any> {
        return this.commands;
    }

    public getAliases(): Map<any, any> {
        return this.aliases;
    }
}