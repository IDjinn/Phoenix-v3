import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed } from "../../util/EmbedFactory";

export default class IAmCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'iam',
            category: 'fun'
        });
    }

    public run({ message, args, phoenixUser }: ICommandParameters) {
        if (args.length === 0)
            return message.reply(phoenixUser.t('commands.iam.errors.are-you-what')).catch();
        
        const iamWhat = args.join(' ');
        const percent = Math.floor((Math.random() * 100) + 1);
        const embed = SimpleEmbed(phoenixUser.t('commands.iam.sucess', percent, iamWhat)).setThumbnail(message.author.displayAvatarURL());
        return message.reply(embed);
    }
}