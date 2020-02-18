import AbstractManager from "../structures/AbstractManager";
import ServerSchema, { IServer } from "../schemas/ServerSchema";
import Server from "../structures/Server";

export default class ServerManager extends AbstractManager{
    private servers: Map<string, Server> = new Map<string, Server>();
    constructor(){
        super('ServerManager');
        this.init();
    }
    public init() {
        this.servers.clear();
        ServerSchema.find({}).then((servers: any[]) => {
            if(servers){
                servers.map(serverData => this.createServer(serverData));
            }
        }).catch(console.error);
    }    
    public destroy() {
        for(let server of this.servers.values()){
            if(!server)
                continue;

            server.destroy();
        }
    }
    private createServer(serverData: any){
        Promise.resolve(() => {
            let server = new Server(serverData as IServer);
            if(server){
                this.servers.set(server.id, server);
            }
            else{
                console.log('parece que a data do servidor n é compatível com a interface.' + serverData);
                //wtf? why im here?
            }
        });
    }
}