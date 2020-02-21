import { RichEmbed } from "discord.js";

export class SimpleEmbed extends RichEmbed{
    constructor(message: string) {
        super();
        this.setDescription(message);
        this.setColor('#fff');
    }
}

export class EmbedWithTitle extends RichEmbed{
    constructor(title: string, message: string, color?: string) {
        super();
        this.setTitle(title);
        this.setDescription(message);
        this.setColor(`#${color ? color : 'fff'}`);
    }
}