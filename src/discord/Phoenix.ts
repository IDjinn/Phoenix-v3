import IConfig from '../../IConfig';
import { Client } from 'discord.js';
import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import DatabaseManager from './managers/DatabaseManager';
import ServerManager from './managers/ServerManager';
import PhoenixUserManager from './managers/PhoenixUserManager';
import TextManager from './managers/TextManager';

export default class Phoenix {
    private static configuration: IConfig = require('../../../config.json') as IConfig;
    private static commandManager = new CommandManager();
    private static eventManager = new EventManager();
    private static databaseManager = new DatabaseManager();
    private static serverManager = new ServerManager();
    private static phoenixUserManager = new PhoenixUserManager();
    private static textManager = new TextManager();
    public static INVITE: string;
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

    public async init() {
        Phoenix.getDatabaseManager().init();
        Phoenix.getServerManager().init();
        Phoenix.getPhoenixUserManager().init();
        Phoenix.getEventManager().init();
        Phoenix.getCommandManager().init();
        Phoenix.getTextManager().init();
        await Phoenix.getClient().login(Phoenix.getConfig().token).then(() => console.log('Logged on discord!')).catch(console.error);
        Phoenix.INVITE = await Phoenix.getClient().generateInvite('ADMINISTRATOR');
    }
    
    public static destroy() {
        Phoenix.getServerManager().destroy();
        Phoenix.getPhoenixUserManager().destroy();
        Phoenix.getEventManager().destroy();
        Phoenix.getCommandManager().destroy();
        Phoenix.getTextManager().destroy();
        Phoenix.getDatabaseManager().destroy();
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

    public static getPhoenixUserManager() {
        return this.phoenixUserManager;
    }

    public static getTextManager() {
        return this.textManager;
    }

    public static getConfig() {
        return this.configuration;
    }
}