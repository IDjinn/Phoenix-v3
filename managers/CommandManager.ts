import AbstractManager from "../structures/AbstractManager";
import AbstractCommand from "../structures/AbstractCommand";
import PingCommand from "../commands/others/Ping";
import { Message } from "discord.js";
import Phoenix from "../Phoenix";
import Server from "../structures/Server";
import PhoenixUser from "../structures/PhoenixUser";

export default class CommandManager extends AbstractManager {
    private commands = new Map();
    private aliases = new Map();
    //private cooldown = new Map();
    constructor() {
        super('CommandManager');
    }
    public init() {
        this.addCommand(new PingCommand());
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
            cmd.run({ message, server, phoenixUser });
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