import IConfig from './IConfig';
import { Client } from 'discord.js';
import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import DatabaseManager from './managers/DatabaseManager';
import ServerManager from './managers/ServerManager';

export default class Phoenix {
    private static configuration: IConfig = require('../config.json') as IConfig;
    private static commandManager = new CommandManager();
    private static eventManager = new EventManager();
    private static databaseManager = new DatabaseManager();
    private static serverManager = new ServerManager();
    private static client: Client = new Client({
        disableEveryone: true,
        disabledEvents: [
            "GUILD_SYNC",
            "CHANNEL_PINS_UPDATE",
            "USER_NOTE_UPDATE",
            "RELATIONSHIP_ADD",
            "RELATIONSHIP_REMOVE",
            "USER_SETTINGS_UPDATE",
            "VOICE_STATE_UPDATE",
            "VOICE_SERVER_UPDATE",
            "TYPING_START",
            "PRESENCE_UPDATE"
        ],
        messageCacheLifetime: 120,
        messageSweepInterval: 480
    });

    public init() {
        Phoenix.getCommandManager().init();
        Phoenix.getEventManager().init();
        Phoenix.getDatabaseManager().init();
        Phoenix.getServerManager().init();
        Phoenix.client.login(Phoenix.getConfig().token).then(() => console.log('Logged on discord!')).catch(console.error);
    }
    
    public destroy() {
        Phoenix.getCommandManager().destroy();
    }

    public static getClient() {
        return this.client;
    }
  
    public static getEventManager() {
        return this.eventManager;
    }
  
    public static getCommandManager() {
        return this.commandManager;
    }
  
    public static getDatabaseManager() {
        return this.databaseManager;
    }
  
    public static getServerManager() {
        return this.serverManager;
    }

    public static getConfig() {
        return this.configuration;
    }
}

new Phoenix().init();