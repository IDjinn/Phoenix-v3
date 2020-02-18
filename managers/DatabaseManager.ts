import AbstractManager from "../structures/AbstractManager";
import mongoose from 'mongoose';
import Phoenix from "../Phoenix";

export default class DatabaseManager extends AbstractManager{
    constructor(){
        super('DatabaseManager');
    }
    public init() {
        const {link, user, password} = Phoenix.configuration.database;
        mongoose.connect(link.replace('%user%', user).replace('%password%',password)).then(() => console.log('Database logged'))
        .catch(console.error);
    }   
    public destroy() {
        mongoose.disconnect().catch(console.error);
    }
}