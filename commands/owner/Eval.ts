import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed } from "../../util/EmbedFactory";
import { RichEmbed } from "discord.js";
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

    public run({ message, args }: ICommandParameters) {
        try {
            if (!args)
                return message.channel.send(SimpleEmbed('Você precisa colocar algum código para ser executado!'));
            
            const evaled = inspect(eval(args.join(' ')))
            message.reply(SimpleEmbed(`Entrada \`\`\`${message.content}\`\`\`\n\nSaída:\`\`\`${cleanEvaledCode(evaled)}\`\`\``));
        } catch (err) {
            message.reply(SimpleEmbed(`Entrada \`\`\`${message.content}\`\`\`\n\nSaída:\`\`\`${cleanEvaledCode(err)}\`\`\``));
        }
    }
}