import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { SimpleEmbed, EmbedWithTitle } from "../../util/EmbedFactory";
import Phoenix from "../../Phoenix";
import { inspect } from 'util';
import sleep from "../../util/Sleep";
const phoenixEval = `
var AutomodModule = require('../../modules/AutomodModule').default;
var CounterModule = require('../../modules/CounterModule').default;
var LevelModule = require('../../modules/LevelModule').default;
var LoggerModule = require('../../modules/LoggerModule').default;
var PermissionsModule = require('../../modules/PermissionsModule').default;
var WelcomeModule = require('../../modules/WelcomeModule').default;
var Phoenix = require('../../Phoenix').default;
var PhoenixUserSchema = require('../../schemas/PhoenixUserSchema').default;
var ServerSchema = require('../../schemas/ServerSchema').default;
var WarnSchema = require('../../schemas/WarnSchema').default;
var AbstractCommand = require('../../structures/AbstractCommand').default;
var PhoenixUser = require('../../structures/PhoenixUser').default;
var Server = require('../../structures/Server').default;
var EmbedFactory = require('../../util/EmbedFactory').default;
var Permissions = require('../../util/Permissions').default;
var sleep = require('../../util/Sleep').default;
var Constants = require('../../util/Constants').default;`;


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
            
            const code = args.join(' ');
            const evaled = cleanEvaledCode(inspect(eval(phoenixEval + '\n' + code)));
            message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`js\n${message.cleanContent}\`\`\`\n\nSaída:\`\`\`js\n${evaled.length > 1900 ? evaled.slice(0, 1900) : evaled}\`\`\``));
            for (let i = 1900; i < evaled.length; i += 1900) {
                await sleep(200);
                message.channel.send(SimpleEmbed(`\`\`\`js\n${evaled.slice(i, i + 1900)}\`\`\``));
            }
        } catch (error) {
            message.reply(EmbedWithTitle('Sucesso', `Entrada \`\`\`js\n${message.cleanContent}\`\`\`\n\nSaída:\`\`\`js\n${error.length > 1900 ? error.slice(0, 1900) : error}\`\`\``));
            for (let i = 1900; i < error.length; i += 1900) {
                await sleep(200);
                message.channel.send(SimpleEmbed(`\`\`\`js\n${error.slice(i, i + 1900)}\`\`\``));
            }
        }
    }
}