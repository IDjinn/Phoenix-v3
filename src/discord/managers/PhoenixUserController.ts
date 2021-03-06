import { Collection, User } from "discord.js";
import PhoenixUser from "../structures/PhoenixUser";
import PhoenixUserSchema from "../schemas/PhoenixUserSchema";
import Phoenix from "../Phoenix";

export default class PhoenixUserController {
    private users: Collection<string, PhoenixUser> = new Collection();

    public init(): void {
        PhoenixUserSchema.find({}).then((users: any[]) => {
            if (users) {
                Promise.all(users.map(userData => this.createUser(userData))).catch(console.error);
            }
        });
    }

    public destroy(): void {
        let user;
        while (user = this.users.values().next().value as PhoenixUser)
            user.save();
    }

    public createUser(userData: any) {
        return new Promise((resolve, reject) => {
            const user = Phoenix.getClient().users.cache.get(userData.id);
            if (user instanceof User) {
                const phoenixUser = new PhoenixUser(user, userData);
                this.users.set(user.id, phoenixUser);
                resolve();
            }
            reject(`User from userData '${userData._id}' === null`);
        });
    }

    public getUser(id: string): PhoenixUser | undefined {
        return this.users.get(id);
    }

    public getOrCreateUser(id: string, user: User): PhoenixUser {
        let phoenixUser = this.getUser(id);
        if (phoenixUser)
            return phoenixUser;
        
        let userData = new PhoenixUserSchema({ id: id }).save() as any;
        this.users.set(id, new PhoenixUser(user, userData));
        return this.getUser(id) as PhoenixUser;
    }

    public getUsers(): Collection<string, PhoenixUser> {
        return this.users;
    }
}