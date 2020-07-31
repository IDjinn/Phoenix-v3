import { Message } from "discord.js";

export const fromMessage = (str: string, message: Message) => {
    return str.replace(/{user}/gi, `${message.member ?? message.author}`)
        .replace(/{username}/gi, `${message.author.username}`)
        .replace(/{nickname}/gi, `${message.member?.nickname ?? message.author.username}`)
        .replace(/{user-id}/gi, `${message.member?.nickname}`)
        .replace(/{tag}/gi, `${message.author.tag}`)
        .replace(/{discriminator}/gi, `${message.author.discriminator}`)
        .replace(/{avatar-url}/gi, `${message.author.displayAvatarURL}`)
        .replace(/{guild}/gi, `${message.guild?.name}`)
        .replace(/{members-count}/gi, `${message.guild?.memberCount}`)
}
