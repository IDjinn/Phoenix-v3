import IConfig from './IConfig';
import { Client } from 'discord.js';
import CommandManager from './managers/CommandManager';

class Phoenix extends Client{
    private configuration: IConfig;
    private commandManager = new CommandManager();
    constructor(){
        super();
        this.configuration = null;
        this.commandManager.init();
    }
    public init() {
        this.login(this.configuration.token).then(() => console.log('Logged on discord!')).catch(console.error);
    }
}