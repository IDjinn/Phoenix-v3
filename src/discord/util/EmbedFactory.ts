import { RichEmbed } from "discord.js";
import Constants from "./Constants";

export function SimpleEmbed(message: string): RichEmbed {
    return new RichEmbed().setDescription(message).setColor(Constants.WHITE_PHOENIX).setTimestamp();
}

export function EmbedWithTitle(title: string, message: string, color?: string): RichEmbed {
    return new RichEmbed().setTitle(title).setDescription(message).setColor(color ? `#${color}` : Constants.WHITE_PHOENIX).setTimestamp();
}