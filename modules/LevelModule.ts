import AbstractModule from "../structures/AbstractModule";
import Server from "../structures/Server";

export default class LevelModule extends AbstractModule{
    public config: ILevelModule;
    constructor(data: ILevelModule, server: Server) {
        super('Level', server);
        this.config = data;
    }
    public init(): void {

    }
    public destroy(): void {

    }
}

export interface ILevelModule{
    serverXpMultiplier: number;
    whitelist: string[];
    blacklist: string[];
    levels: ILevel[];
}

export interface ILevel{
    xpNeed: bigint;
    giveRoles: string[];
    takeRoles: string[];
    xpMultiplier: number;
}