import { Collection, User } from "discord.js";
import PhoenixUser from "../structures/PhoenixUser";
import PhoenixUserSchema from "../schemas/PhoenixUserSchema";
import Phoenix from "../Phoenix";
import logger from "../util/logger/Logger";

export default class PhoenixUserController {
    private users: Collection<string, PhoenixUser> = new Collection();

    public init(): void {
        PhoenixUserSchema.find({}).then((users: any[]) => {
            if (users) {
                Promise.all(users.map(userData => this.createUser(userData))).catch(logger.error);
            }
        });
    }

    public destroy(): void {
        let user;
        while (user = this.users.values().next().value as PhoenixUser)
            user.save();
    }

    public createUser(userData: any) :PhoenixUser {
        if (userData && userData.id) {
            const user = Phoenix.getClient().users.cache.get(userData.id);
            if (user instanceof User) {
                const phoenixUser = new PhoenixUser(user, userData);
                this.users.set(user.id, phoenixUser);
                return phoenixUser;
            }
            PhoenixUserSchema.deleteMany({ id: userData.id })//If isn't found, delete from database.
        }
        throw new Error(userData);
    }

    public getUser(id: string): PhoenixUser | undefined {
        return this.users.get(id);
    }
    
    public async getOrCreateUser(id: string, user: User): Promise<PhoenixUser> {
        let phoenixUser = this.getUser(id);
        if (phoenixUser)
            return phoenixUser;
        
        const dbUserData = await PhoenixUserSchema.findOne({ id: id });
        if (dbUserData)
            return this.createUser(dbUserData);
        
        let userData = await new PhoenixUserSchema({ id: id }).save() as any;
        this.users.set(id, new PhoenixUser(user, userData));
        return this.getUser(id) as PhoenixUser;
    }

    public getUsers(): Collection<string, PhoenixUser> {
        return this.users;
    }
}