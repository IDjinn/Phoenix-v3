import Server from "./Server";

export default abstract class AbstractModule{
    public readonly name: string;
    public abstract config: any;
    private server: Server;
    constructor(name: string, server: Server){
        this.name = name;
        this.server = server;
    }
    public abstract init(): void;
    public abstract destroy(): void;
    public getServer(): Server{
        return this.server;
    }
}