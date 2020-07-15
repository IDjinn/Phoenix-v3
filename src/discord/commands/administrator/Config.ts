import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import { EmbedWithTitle } from "../../util/EmbedFactory";
import { IMenuPage, ReactionCollector } from 'discord.js-collector';
import { MessageEmbed } from "discord.js";
const welcomeConfigEmbed = EmbedWithTitle('Welcome Config', `
Reaja com o emoji específico
📥 Entrada
🔐 Cargo automático ao entrar
📤 Saída
`);

const pages = {
    '📥': {
        embed: EmbedWithTitle('Welcome Join Config', `
    Reaja com o emoji específico para configurar a entrada de usuários
    📜 Configurar canal
    📢 Configurar mensagem
    `),
        reactions: ['📜', '📢'],
        pages: {
            '📜': {
                embed: new MessageEmbed({ description: 'teste configurar canal' })
            },
            '📢': {
                embed: new MessageEmbed({ description: 'teste configurar mensagem' })
            }
        }
    },
} as IMenuPage;
/*
const welcomeJoinConfigEmbed = EmbedWithTitle('Welcome Join Config', `
Reaja com o emoji específico para configurar a entrada de usuários
📜 Configurar canal
📢 Configurar mensagem
`)*/

export default class ConfigCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'config',
            category: 'administrator',
            permissionsNeed: ['MANAGE_GUILD'],
            subCommands: [{ methodName: 'welcome' }]
        });
    }

    public async welcome({ message }: ICommandParameters) {

        const botMessage = await message.channel.send(welcomeConfigEmbed);
        ReactionCollector.menu({ botMessage, user: message, pages });
    }
    /*
        private async welcomeJoin(msg: Message, user: string) {
            await msg.reactions.removeAll();
            await msg.edit(welcomeJoinConfigEmbed);
            ReactionCollector.question({
                botMessage: msg, user, reactions: ['📜', '📢'], onReact: [
                    (msg: Message) => msg.reply('a'),
                    (msg: Message) => msg.reply('b')
                ]
            });
        }*/

    public async run({ }) {

    }
}