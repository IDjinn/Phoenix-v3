import LoggerModule from "../modules/LoggerModule";
import { IServer } from "../schemas/ServerSchema";
import PermissionsModule from "../modules/PermissionsModule";
import AutomodModule from "../modules/AutomodModule";
import { Guild } from "discord.js";
import LevelModule from "../modules/LevelModule";
import CounterModule from "../modules/CounterModule";
import WelcomeModule from "../modules/WelcomeModule";
import { Language } from "../managers/TextManager";
import Phoenix from "../Phoenix";

export default class Server {
    private data: IServer;
    private guild: Guild;
    public readonly id: string;
    public readonly prefix: string;
    public readonly lang: Language;
    private loggerModule: LoggerModule;
    private permissionsModule: PermissionsModule;
    private automodModule: AutomodModule;
    private levelModule: LevelModule;
    private counterModule: CounterModule;
    private welcomeModule: WelcomeModule;
    constructor(guild: Guild, data: IServer) {
        this.data = data;
        this.guild = guild;
        this.id = this.data.id;
        this.prefix = this.data.prefix;
        this.lang = this.data.language;
        this.loggerModule = new LoggerModule(this.data.logger, this);
        this.permissionsModule = new PermissionsModule(this.data.roles, this);
        this.automodModule = new AutomodModule(this.data.automod, this);
        this.counterModule = new CounterModule(this.data.counter, this);
        this.levelModule = new LevelModule(this.data.level, this);
        this.welcomeModule = new WelcomeModule(this.data.welcome, this);
        this.init();
    }

    public init() {
        this.loggerModule.init();
        this.permissionsModule.init();
        this.automodModule.init();
        this.counterModule.init();
        this.levelModule.init();
        this.welcomeModule.init();
    }

    public destroy() {
        this.loggerModule.destroy();
        this.permissionsModule.destroy();
        this.automodModule.destroy();
        this.counterModule.destroy();
        this.levelModule.destroy();
        this.welcomeModule.destroy();
    }

    public t(key: string, ...args: any): string {
        return Phoenix.getTextManager().t(this.lang, key, args);
    }

    public getLoggerModule(): LoggerModule {
        return this.loggerModule;
    }

    public getPermissionsModule(): PermissionsModule {
        return this.permissionsModule;
    }

    public getAutomodModule(): AutomodModule {
        return this.automodModule;
    }

    public getLevelModule(): LevelModule {
        return this.levelModule;
    }

    public getCounterModule(): CounterModule {
        return this.counterModule;
    }

    public getWelcomeModule(): WelcomeModule {
        return this.welcomeModule;
    }

    public getGuild(): Guild {
        return this.guild;
    }
}