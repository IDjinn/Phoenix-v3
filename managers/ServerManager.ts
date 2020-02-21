import AbstractManager from "../structures/AbstractManager";
import ServerSchema, { IServer } from "../schemas/ServerSchema";
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
                Promise.all(servers.map(serverData => this.createServer(serverData))).catch(console.error);
            }
        }).catch(console.error);
    }

    public destroy() {
        this.servers.map(server => server.destroy());
    }

    public createServer(serverData: any) {
        return new Promise((resolve, reject) => {
            let guild = Phoenix.getClient().guilds.get(serverData.id);
            if (guild instanceof Guild) {
                this.servers.set(serverData.id, new Server(guild, serverData));
                resolve(true);
            }
            reject(false);
            //todo: delete this server, guild not found
        });
    }

    public getServer(id: string): Server | undefined {
        return this.servers.get(id);
    }

    public getServers(): Collection<string, Server> {
        return this.servers;
    }
}