import AbstractManager from "../structures/AbstractManager";
import ServerSchema, { IServer } from "../schemas/ServerSchema";
import Server from "../structures/Server";
import { Collection } from "discord.js";

export default class ServerManager extends AbstractManager {
    private servers: Collection<string, Server> = new Collection<string, Server>();
    constructor() {
        super('ServerManager');
    }
    public init() {
        this.servers.clear();
        ServerSchema.find({}).then((servers: any[]) => {
            if (servers) {
                servers.map(serverData => this.createServer(serverData));
            }
        }).catch(console.error);
    }
    public destroy() {
        this.servers.map(server => server.destroy());
    }
    public createServer(serverData: any) {
        this.servers.set(serverData.id, new Server(serverData));
    }

    public getServer(id: string): Server | undefined {
        return this.servers.get(id);
    }

    public getServers(): Collection<string, Server> {
        return this.servers;
    }
}