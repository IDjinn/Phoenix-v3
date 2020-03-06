import { User } from "discord.js";
import PhoenixUserSchema, { IPhoenixUser } from "../schemas/PhoenixUserSchema";
import { Language } from "../managers/TextManager";
import Phoenix from "../Phoenix";

export default class PhoenixUser{
    private id: string;
    private user: User;
    private level: number;
    private xp: number;
    private xpMultiplier: number;
    private coins: number;
    private rep: number;
    private bio: string;
    private lang: Language;
    constructor(user: User, userData: IPhoenixUser) {
        this.user = user;
        this.id = this.user.id;
        this.coins = userData.coins;
        this.rep = userData.rep;
        this.bio = userData.bio;
        this.level = userData.level;
        this.xp = userData.xp;
        this.xpMultiplier = userData.xpMultiplier;
        this.lang = userData.lang;
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

    public getXpMultiplier(): number{
        return this.xpMultiplier;
    }

    public getLang(): Language {
        return this.lang;
    }

    public t(key: string, ...args: any): string {
        return Phoenix.getTextManager().t(Language.en_US, key, args);
    }

    public setXp(xp: number, updateDatabase?: boolean) {
        this.xp = xp;
        if (updateDatabase)
            PhoenixUserSchema.findOneAndUpdate({ id: this.id }, { xp: this.getXp() }).catch();
    }

    public setLevel(level: number, updateDatabase?: boolean) {
        this.level = level;
        if (updateDatabase)
            PhoenixUserSchema.findOneAndUpdate({ id: this.id }, { level: this.getLevel() }).catch();
    }

    public save() {
        PhoenixUserSchema.findByIdAndUpdate({ id: this.id }, {
            level: this.level,
            xp: this.xp,
            xpMultiplier: this.xpMultiplier,
            coins: this.coins,
            rep: this.rep,
            bio: this.bio
        }).catch();
    }
}