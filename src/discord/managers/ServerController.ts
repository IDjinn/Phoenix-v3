import ServerSchema from "../schemas/ServerSchema";
import Server from "../structures/Server";
import { Collection, Guild } from "discord.js";
import Phoenix from "../Phoenix";
import logger from "../util/logger/Logger";

export default class ServerController {
    private servers: Collection<string, Server> = new Collection<string, Server>();

    public init() {
        this.servers.clear();
        ServerSchema.find({}).then((servers: any[]) => {
            if (servers)
                Promise.all(servers.map(serverData => this.createServer(serverData, Phoenix.getClient().guilds.cache.get(serverData._id)))).catch(logger.error);
        }).catch(logger.error);
    }

    public destroy() {
        /*todo: this
        this.servers.save();*/
    }

    public createServer(serverData: any, guild?: Guild): Server {
        if (serverData && guild instanceof Guild) {
            const server = new Server(guild, serverData);
            this.servers.set(serverData._id, server);
            return server;
        }
        throw new Error(`Guild from ServerData ${serverData._id} === null //delete?`);
    }

    public getServer(id: string) : Server | undefined {
        return this.servers.get(id);
    }
    
    public async getOrCreateServer(id: string, guild: Guild) : Promise<Server>{
        const server = this.getServer(id);
        if (server)
            return server;
        
        const dbServer = await ServerSchema.findOne({ id: id });
        if (dbServer)
            return this.createServer(dbServer);
        
        const serverData = new ServerSchema({ _id: id }).save() as any;
        this.servers.set(id, new Server(guild, serverData));
        return this.getServer(id) as Server;
    }  

    public deleteServer(id: string): void {
        let server = this.servers.get(id);
        if (server) {
            this.servers.delete(id);
        }
        ServerSchema.deleteMany({ _id: id });
    }
    
    public getServers(): Collection<string, Server> {
        return this.servers;
    }
}