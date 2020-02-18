import IConfig from './IConfig';
import { Client } from 'discord.js';
import CommandManager from './managers/CommandManager';

export default class Phoenix extends Client{
    private configuration: IConfig;
    private commandManager = new CommandManager();
    constructor(){
        super();
        this.configuration = null;
        this.commandManager.init();
    }
    public init() {
        super.login(this.configuration.token).then(() => console.log('Logged on discord!')).catch(console.error);
    }

    static get configuration(): IConfig{
        return this.configuration;
    }

    static get commandManager(): CommandManager{
        return this.commandManager;
    }
}

new Phoenix();