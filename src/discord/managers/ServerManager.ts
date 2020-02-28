import AbstractManager from "../structures/AbstractManager";
import ServerSchema from "../schemas/ServerSchema";
import Server from "../structures/Server";
import { Collection, Guild } from "discord.js";
import Phoenix from "../Phoenix";

export default class ServerManager extends AbstractManager {
    private servers: Collection<string, Server> = new Collection<string, Server>();
    constructor() {
        super('ServerManager');
    }

    public init() {
        this.servers.clear();
        ServerSchema.find({}).then((servers: any[]) => {
            if (servers) {
                //todo: recode this?
                Promise.all(servers.map(serverData => this.createServer(serverData, Phoenix.getClient().guilds.get(serverData.id)))).catch(console.error);
            }
        }).catch(console.error);
    }

    public destroy() {
        this.servers.map(server => server.destroy());
    }

    public createServer(serverData: any, guild?: Guild) : Promise<Server> {
        return new Promise((resolve, reject) => {
            if (guild instanceof Guild) {
                let server = new Server(guild, serverData);
                this.servers.set(serverData.id, server);
                resolve(server);
            }
            reject(ServerSchema.deleteMany({ id: serverData.id }));
        });
    }

    public getServer(id: string) : Server | undefined {
        return this.servers.get(id);
    }
    
    public getOrCreateServer(id: string, guild: Guild) : Server{
        let server = this.getServer(id);
        if (server)
            return server;
        
        let serverData = new ServerSchema({ id: id }).save() as any;
        this.servers.set(id, new Server(guild, serverData));
        return this.getServer(id) as Server;
    }  

    public deleteServer(id: string): void {
        let server = this.servers.get(id);
        if (server) {
            server.destroy();
            this.servers.delete(id);
        }
        ServerSchema.deleteMany({ id: id });
    }
    
    public getServers(): Collection<string, Server> {
        return this.servers;
    }
}