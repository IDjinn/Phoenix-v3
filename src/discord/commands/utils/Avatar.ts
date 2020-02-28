import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { EmbedWithTitle, SimpleEmbed } from "../../util/EmbedFactory";

export default class AvatarCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'avatar',
            description: 'Show the user avatar.'
        });
    }

    public run({ message, args }: ICommandParameters) {
        const member = message.mentions.members.first() || (args ? message.guild.members.get(args[0]) : message.member);
        message.reply(SimpleEmbed(`${member.displayName}'s Avatar`).setImage(member.user.displayAvatarURL)).catch();
    }
}