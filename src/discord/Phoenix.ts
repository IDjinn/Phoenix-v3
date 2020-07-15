import IConfig from '../../IConfig';
import { Client } from 'discord.js';
import CommandController from './controllers/CommandController';
import EventController from './controllers/EventController';
import ServerController from './controllers/ServerController';
import PhoenixUserController from './controllers/PhoenixUserController';
import TextController from './controllers/TextController';
import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose';
import sleep from './util/Sleep';
import logger from './util/logger/Logger';

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
        let timer = Date.now();
        const { link, user, password } = Phoenix.getConfig().database;
        mongooseConnect(link.replace('%user%', user).replace('%password%', password), { useNewUrlParser: true, useUnifiedTopology: true }).then(() => logger.info('Database Ready')).catch(logger.error);
        Phoenix.getClient().login(Phoenix.getConfig().token).then(() => logger.info('Logged on discord')).catch(logger.error);
        Phoenix.getTextController().init();
        logger.debug(`Text controller ready at ${Date.now() - timer}ms.`);
        timer = Date.now();
        Phoenix.getCommandController().init();
        logger.debug(`Command controller ready at ${Date.now() - timer}ms.`);
        Phoenix.getClient().on('ready', () => {
            sleep(1_000);
            timer = Date.now();
            Phoenix.getServerController().init();
            logger.debug(`Server controller ready at ${Date.now() - timer}ms.`);
            timer = Date.now();
            Phoenix.getPhoenixUserController().init();
            logger.debug(`PhoenixUser controller ready at ${Date.now() - timer}ms.`);
            sleep(1_000);
            timer = Date.now();
            Phoenix.getEventController().init();
            logger.debug(`Event controller ready at ${Date.now() - timer}ms.`);
            /*
            for (const server of Phoenix.getServerController().getServers().values()) {
                CounterModule.updateCounters(server);
            }*/
            if (Phoenix.getConfig().website.enabled) {
                logger.debug('Loading website');
                require('../website/website');
            }
            logger.info('Ready');
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