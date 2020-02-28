import Phoenix from "../../Phoenix";
import moment from 'moment';

export default class Logger {
    private className: string;
    constructor(className: string){
        this.className = className;
    }
    public debug(message: string, args?: string[]) {
        if (Phoenix.getConfig().logLevel < LogLevel.DEBUG)
            return;
        
        this.print(message, LogLevel.DEBUG)
    }

    public print(str: string, logLevel: LogLevel) {
        console.log(`[${moment().format('h:mm:ss:SSS')}] [${this.className}] [${LogLevel[logLevel]}] ${str}`);
    }
}

export enum LogLevel{
    INFO,
    WARN,
    ERROR,
    CRITICAL,
    DEBUG
}