import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { Language } from "../../managers/TextController";
import Phoenix from "../../Phoenix";

export default class LanguageCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'language',
            description: 'Changes bot language for you.',
            category: 'utils'
        })
    }

    public run({ message, phoenixUser, args }: ICommandParameters) {
        if (args.length === 0)
            return message.reply(phoenixUser.t('commands.language.errors.no-lang'));

        const newLang = Phoenix.getTextController().parseLanguage(args[0]);
        if (newLang === -1)
            return message.reply(phoenixUser.t('commands.language.errors.invalid-lang'));

        phoenixUser.setLang(newLang as Language, true);
        return message.reply(phoenixUser.t('commands.language.sucess', phoenixUser.t(`languages.${newLang}.name`)));
    }
}