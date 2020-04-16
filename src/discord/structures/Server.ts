import { ILogger } from "../modules/LoggerModule";
import { IServer } from "../schemas/ServerSchema";
import { IRole } from "../modules/PermissionsModule";
import { IAutomod } from "../modules/AutomodModule";
import { Guild, Collection } from "discord.js";
import { ILevelModule } from "../modules/LevelModule";
import { ICounter } from "../modules/CounterModule";
import { IWelcome } from "../modules/WelcomeModule";
import { Language } from "../managers/TextController";
import Phoenix from "../Phoenix";
import { ICommands } from "../managers/CommandController";

export default class Server {
    public readonly id: string;
    private readonly guild: Guild;
    public readonly data: IServer;
    public readonly prefix: string;
    public muteRole: string;
    public readonly lang: Language;
    private logger: ILogger;
    private roles: IRole[];
    private automod: IAutomod;
    private level: ILevelModule;
    private counter: ICounter;
    private welcome: IWelcome;
    public readonly commands: ICommands;
    public mutes = new Collection();
    constructor(guild: Guild, data: IServer) {
        this.data = data;
        this.guild = guild;
        this.id = this.data._id;
        this.prefix = this.data.prefix;
        this.muteRole = this.data.muteRole;
        this.commands = this.data.commands;
        this.lang = this.data.language;
        this.logger = this.data.logger || {};
        this.roles = this.data.roles || {};
        this.automod = this.data.automod || {};
        this.counter = this.data.counter || {};
        this.level = this.data.level || {};
        this.welcome = this.data.welcome || {};
    }

    public t(key: string, ...args: any): string {
        return Phoenix.getTextController().t(this.lang, key, args);
    }

    public getLogger(): ILogger {
        return this.logger;
    }

    public getRoles(): IRole[] {
        return this.roles;
    }

    public getAutomod(): IAutomod {
        return this.automod;
    }

    public getLevel(): ILevelModule {
        return this.level;
    }

    public getCounter(): ICounter {
        return this.counter;
    }

    public getWelcome(): IWelcome {
        return this.welcome;
    }

    public getGuild(): Guild {
        return this.guild;
    }
}