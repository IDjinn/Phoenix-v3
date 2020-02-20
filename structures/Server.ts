import LoggerModule from "../modules/LoggerModule";
import { IServer } from "../schemas/ServerSchema";
import PermissionsModule from "../modules/PermissionsModule";
import AutomodModule from "../modules/AutomodModule";
import { Guild } from "discord.js";

export default class Server {
    private data: IServer;
    private guild: Guild;
    public readonly id: string;
    public readonly prefix: string;
    private loggerModule: LoggerModule;
    private permissionsModule: PermissionsModule;
    private automodModule: AutomodModule;
    constructor(guild: Guild, data: IServer) {
        this.data = data;
        this.guild = guild;
        this.id = this.data.id;
        this.prefix = this.data.prefix;
        this.loggerModule = new LoggerModule(this.data.logger, this);
        this.permissionsModule = new PermissionsModule([], this);
        this.automodModule = new AutomodModule(this.data.automod, this);
        this.init();
    }

    public init() {
        this.loggerModule.init();
        this.permissionsModule.init();
    }

    public destroy() {
        this.loggerModule.destroy();
        this.permissionsModule.destroy();
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

    public getGuild(): Guild{
        return this.guild;
    }
}