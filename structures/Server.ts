import LoggerModule from "../modules/LoggerModule";
import { IServer } from "../schemas/ServerSchema";

export default class Server{
    private data: IServer;
    public readonly id: string;
    private loggerModule: LoggerModule;
    constructor(data: IServer){
        this.data = data;
        this.loggerModule = new LoggerModule(this.data.logger);
        this.init();
    }
    public init(){
        this.loggerModule.init();
    }
    public destroy(){
        this.loggerModule.destroy();
    }
}