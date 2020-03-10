import IConfig from '../../IConfig';
import { Client } from 'discord.js';
import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import ServerManager from './managers/ServerManager';
import PhoenixUserManager from './managers/PhoenixUserManager';
import TextManager from './managers/TextManager';
import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';

export default class Phoenix {
    private static configuration: IConfig = require('../../../config.json') as IConfig;
    private static commandManager = new CommandManager();
    private static eventManager = new EventManager();
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
        const { link, user, password } = Phoenix.getConfig().database;
        try {
            await mongooseConnect(link.replace('%user%', user).replace('%password%', password), { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Database ready');
            Phoenix.getServerManager().init();
            Phoenix.getPhoenixUserManager().init();
            Phoenix.getEventManager().init();
            Phoenix.getCommandManager().init();
            await Phoenix.getClient().login(Phoenix.getConfig().token).then(() => console.log('Logged on discord!')).catch(console.error);
        }
        catch (error) {
            console.error(`Mongoose doesn't connected, Phoenix is shuttedown. Error: ${error}`);
        }
    }
    
    public static destroy() {
        Phoenix.getServerManager().destroy();
        Phoenix.getPhoenixUserManager().destroy();
        Phoenix.getEventManager().destroy();
        Phoenix.getCommandManager().destroy();
        mongooseDisconnect();
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
  
    public static getServerManager() {
        return this.serverManager;
    }

    public static getPhoenixUserManager() {
        return this.phoenixUserManager;
    }

    public static getTextManager(){
        return this.textManager;
    }

    public static getConfig() {
        return this.configuration;
    }
}