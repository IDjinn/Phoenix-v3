import { RichEmbed } from "discord.js";

export function SimpleEmbed(message: string): RichEmbed {
    return new RichEmbed().setDescription(message).setColor('#fff');
}

export function EmbedWithTitle(title: string, message: string, color?: string): RichEmbed {
    return new RichEmbed().setTitle(title).setDescription(message).setColor(`#${color ? color : 'fff'}`);
}