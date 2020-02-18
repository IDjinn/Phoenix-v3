import AbstractManager from "../structures/AbstractManager";
import AbstractCommand from "../structures/AbstractCommand";
import PingCommand from "../commands/others/Ping";
import { Message } from "discord.js";

export default class CommandManager extends AbstractManager{
    private commands = new Map();
    private aliases = new Map();
    constructor() {
        super('CommandManager');
    }
    public init() {
        this.addCommand(new PingCommand());
    }
    public destroy() {
        this.commands.clear();
        this.aliases.clear();
    }
    public handledCommand(message: Message): boolean{
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