import AbstractManager from "../structures/AbstractManager";
import { Collection, User } from "discord.js";
import PhoenixUser from "../structures/PhoenixUser";
import PhoenixUserSchema from "../schemas/PhoenixUserSchema";
import Phoenix from "../Phoenix";

export default class PhoenixUserManager extends AbstractManager {
    private users: Collection<string, PhoenixUser> = new Collection();
    constructor() {
        super('PhoenixUser');
    }

    public init(): void {
        PhoenixUserSchema.find({}).then((users: any[]) => {
            if (users) {
                Promise.all(users.map(userData => this.createUser(userData))).catch(console.error);
            }
        });
    }

    public destroy(): void {
        this.users.clear();
    }

    public createUser(userData: any) {
        return new Promise((resolve, reject) => {
            let user = Phoenix.getClient().users.get(userData.id);
            if (user instanceof User) {
                resolve(this.users.set(user.id, new PhoenixUser(user, userData)));
            }
            //todo delete this user, him not found
            reject(false);
        });
    }

    public getUser(id: string): PhoenixUser | undefined {
        return this.users.get(id);
    }

    public getUsers(): Collection<string, PhoenixUser> {
        return this.users;
    }
}