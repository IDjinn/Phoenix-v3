import IConfig from '../../IConfig';
import { Client } from 'discord.js';
import CommandController from './managers/CommandController';
import EventController from './managers/EventController';
import ServerController from './managers/ServerController';
import PhoenixUserController from './managers/PhoenixUserController';
import TextController from './managers/TextController';
import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';
import sleep from './util/Sleep';

export default class Phoenix {
    private static configuration: IConfig = require('../../../config.json') as IConfig;
    private static commandController = new CommandController();
    private static eventController = new EventController();
    private static serverController = new ServerController();
    private static phoenixUserController = new PhoenixUserController();
    private static textController = new TextController();
    public static INVITE: string;
    private static client: Client = new Client({
        disableMentions: 'everyone',/*
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
        ],*/
        messageCacheLifetime: 120,
        messageSweepInterval: 480
    });

    public init() {
        const { link, user, password } = Phoenix.getConfig().database;
        mongooseConnect(link.replace('%user%', user).replace('%password%', password), { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => console.log('Database ready')).catch(console.error);
        Phoenix.getClient().login(Phoenix.getConfig().token).then(() => console.log('Logged on discord!')).catch(console.error);
        Phoenix.getCommandController().init();
        Phoenix.getTextController().init();
        Phoenix.getClient().on('ready', async () => {
            await sleep(1_000);
            Phoenix.getServerController().init();
            Phoenix.getPhoenixUserController().init();
            await sleep(1_000);
            Phoenix.getEventController().init();
            console.log('ready');
        });
    }

    public static destroy() {
        Phoenix.getServerController().destroy();
        Phoenix.getPhoenixUserController().destroy();
        Phoenix.getEventController().destroy();
        Phoenix.getCommandController().destroy();
        mongooseDisconnect();
    }

    public static getClient() {
        return this.client;
    }

    public static getEventController() {
        return this.eventController;
    }

    public static getCommandController() {
        return this.commandController;
    }

    public static getServerController() {
        return this.serverController;
    }

    public static getPhoenixUserController() {
        return this.phoenixUserController;
    }

    public static getTextController() {
        return this.textController;
    }

    public static getConfig() {
        return this.configuration;
    }
}