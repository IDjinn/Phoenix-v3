import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed } from "../../util/EmbedFactory";

export default class AvatarCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'avatar',
            category: 'utils',
            botPermissionsNeed: ['EMBED_LINKS']
        });
    }

    public async run({ message, args }: ICommandParameters) {
        if (!message.guild)
            throw 'message.guild === null';

        if (!message.member)
            throw 'message.member === null';

        if (!message.member.user)
            throw 'message.member.user === null';

        let member = message.mentions.members ? message.mentions.members.first() : null;
        if (!member && args.length > 0) member = message.guild.members.cache.get(args[0]);
        if (!member) member = message.member;
        return message.reply(SimpleEmbed(`${member.displayName}'s Avatar`).setImage(member.user.displayAvatarURL())).catch();
    }
}