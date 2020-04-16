export default interface IConfig{
    token: string;
    defaultPrefix: string;
    logLevel: string;
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