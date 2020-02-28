export default interface IConfig{
    token: string;
    defaultPrefix: string;
    logLevel: number;
    database: {
        link: string
        user: string;
        password: string;
    };
    website: {
        enabled: boolean;
        port: number;
    };
}