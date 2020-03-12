import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed, EmbedWithTitle } from "../../util/EmbedFactory";
import Phoenix from "../../Phoenix";
import { inspect } from 'util';

const replaceAll = (str: string, find: string, replace: string) => {
    const matches = str.match(find);
    if (matches) {
        for (const match of matches) {
            str = str.replace(match, replace);
        }
    }
    return str;
}

const cleanEvaledCode = (text: string) => {
    text = text.toString().replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).replace(/\n/g, '\n' + String.fromCharCode(8203));
    return replaceAll(text, Phoenix.getClient().token, '•••••••••');
}

export default class EvalCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'eval',
            description: 'beep boop',
            onlyOwner: true,
            enabled: false
        });
    }

    public async run({ message, args }: ICommandParameters) {
        try {
            if (!args)
                return message.channel.send(SimpleEmbed('Você precisa colocar algum código para ser executado!'));

            const evaled = inspect(eval(args.join(' ')))
            return message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`${message.content}\`\`\`\n\nSaída:\`\`\`${cleanEvaledCode(evaled)}\`\`\``));
        } catch (err) {
            return message.reply(EmbedWithTitle('Erro', `Entrada \`\`\`${message.content}\`\`\`\n\nSaída:\`\`\`${cleanEvaledCode(err)}\`\`\``));
        }
    }
}