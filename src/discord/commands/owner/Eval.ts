import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed, EmbedWithTitle } from "../../util/EmbedFactory";
import Phoenix from "../../Phoenix";
import { inspect } from 'util';
import sleep from "../../util/Sleep";

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
    return replaceAll(text, `${Phoenix.getClient().token}`, '~•TOKEN•~');
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

    public async run({ message, args }: ICommandParameters): Promise<any> {
        try {
            if (args.length === 0)
                return message.channel.send(SimpleEmbed('Você precisa colocar algum código para ser executado!'));

            const evaled = cleanEvaledCode(inspect(eval(args.join(' '))));
            if (evaled.length < 1900) {
                return message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`js\n${message.cleanContent}\`\`\`\n\nSaída:\`\`\`js\n${evaled}\`\`\``));
            } else {
                message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`js\n${message.cleanContent}\`\`\`\n\nSaída:\`\`\`js\n${evaled.slice(0, 1900)}\`\`\``));
                for (let i = 1900; i < evaled.length; i += 1950) {
                    await sleep(200);
                    message.channel.send(SimpleEmbed(`\`\`\`js\n${evaled.slice(i, i + 1950)}\`\`\``));
                }
            }
        } catch (error) {
            if (error.length < 1900) {
                return message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`${message.cleanContent}\`\`\`\n\nSaída:\`\`\`js\n${error}\`\`\``));
            } else {
                message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`js\n${message.cleanContent}\`\`\`\n\nSaída:\`\`\`js\n${error.slice(0, 1900)}\`\`\``));
                for (let i = 1900; i < error.length; i += 1950) {
                    await sleep(200);
                    message.channel.send(SimpleEmbed(`\`\`\`js\n${error.slice(i, i + 1950)}\`\`\``));
                }
            }
        }
    }
}