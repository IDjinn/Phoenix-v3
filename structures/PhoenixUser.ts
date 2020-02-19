import { User } from "discord.js";

export default class PhoenixUser{
    private user: User;
    constructor(user: User) {
        this.user = user;
    }

    public getUser(): User{
        return this.user;
    }
}