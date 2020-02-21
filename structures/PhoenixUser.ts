import { User } from "discord.js";
import PhoenixUserSchema, { IPhoenixUser } from "../schemas/PhoenixUserSchema";

export default class PhoenixUser{
    private user: User;
    private level: number;
    private xp: number;
    private id: string;
    private coins: number;
    private rep: number;
    private bio: string;
    constructor(user: User, userData: IPhoenixUser) {
        this.user = user;
        this.id = this.user.id;
        this.coins = userData.coins;
        this.rep = userData.rep;
        this.bio = userData.bio;
        this.level = userData.level;
        this.xp = userData.xp;
    }

    public getLevel(): number{
        return this.level;
    }

    public getXp(): number{
        return this.xp;
    }

    public getUser(): User{
        return this.user;
    }

    public setXp(xp: number, updateDatabase?: boolean) {
        this.xp = xp;
        if (updateDatabase)
            PhoenixUserSchema.findOneAndUpdate({ id: this.getUser().id }, { xp: this.getXp() }).catch();
    }

    public setLevel(level: number, updateDatabase?: boolean) {
        this.level = level;
        if (updateDatabase)
            PhoenixUserSchema.findOneAndUpdate({ id: this.getUser().id }, { level: this.getLevel() }).catch();
    }
}