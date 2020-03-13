import { MessageEmbed } from "discord.js";
import Constants from "./Constants";

export function SimpleEmbed(message: string): MessageEmbed {
    return new MessageEmbed().setDescription(message).setColor(Constants.WHITE_PHOENIX).setTimestamp();
}

export function EmbedWithTitle(title: string, message: string, color?: string): MessageEmbed {
    return new MessageEmbed().setTitle(title).setDescription(message).setColor(color ? `#${color}` : Constants.WHITE_PHOENIX).setTimestamp();
}