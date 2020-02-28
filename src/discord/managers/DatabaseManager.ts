import AbstractManager from "../structures/AbstractManager";
import Phoenix from "../Phoenix";
import mongoose from 'mongoose';

export default class DatabaseManager extends AbstractManager {
    constructor() {
        super('DatabaseManager');
    }

    public init() {
        const { link, user, password } = Phoenix.getConfig().database;
        mongoose.connect(link.replace('%user%', user).replace('%password%', password), { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('Database logged')).catch(console.error);
    }

    public destroy() {
        mongoose.disconnect().catch(console.error);
    }
}