import AbstractManager from "../structures/AbstractManager";
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

export default class CommandManager extends AbstractManager {
    private commands = new Map();
    private aliases = new Map();
    //private cooldown = new Map();
    constructor() {
        super('CommandManager');
    }
    public init() {
        this.addCommand(new PingCommand());
        this.addCommand(new KickCommand());
        this.addCommand(new BanCommand());
        this.addCommand(new BotinfoCommand());
        this.addCommand(new AvatarCommand());
        this.addCommand(new EvalCommand());
    }
    public destroy() {
        this.commands.clear();
        this.aliases.clear();
        //this.cooldown.clear(); 
    }

    public handledCommand(message: Message, server: Server, phoenixUser: PhoenixUser): boolean {
        let prefix = '';
        for (const thisPrefix of [Phoenix.getConfig().defaultPrefix, server.prefix, `<@!${message.guild.me.id}> `]) {
            if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }

        if (prefix.length <= 0)
            return false;

        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift();
        const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command));
        if (cmd instanceof AbstractCommand) {
            //todo: implements cooldown
            const callback = cmd.run({ message, server, phoenixUser, args });
            if (callback instanceof Error)
                console.error(callback) // todo send to user error message
            //else = command executed?
        }
        
        return true;
    }

    private addCommand(command: AbstractCommand) {
        this.commands.set(command.name, command);
        if (command.aliases.length > 0) {
            command.aliases.forEach(aliase => {
                this.aliases.set(aliase, command.name);
            });
        }
    }
}