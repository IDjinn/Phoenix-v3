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

    public async run({ message, ctx }: ICommandParameters) {
        const member = ctx.getMember(false, true);
        if (!member)
            return;
        
        return message.reply(SimpleEmbed(`${member.displayName}'s Avatar`).setImage(member.user.displayAvatarURL())).catch();
    }
}