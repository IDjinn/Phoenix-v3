export default interface IConfig{
    token: string;
    defaultPrefix: string;
    database: {
        link: string
        user: string;
        password: string;
    }
}