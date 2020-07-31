import * as Placeholders from "../../util/Placeholders";
import { IMenuPage, ReactionCollector } from 'discord.js-collector';
import { Message } from "discord.js";
import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class ConfigCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'config',
            category: 'administrator',
            cooldownType: 'GUILD',
            cooldown: 7_000,
            permissionsNeed: ['MANAGE_GUILD'],
            subCommands: [{ methodName: 'welcome' }]
        });
    }

    public async welcome({ message, ctx }: ICommandParameters) {
        const pages = {
            '📥': {
                embed: {
                    title: 'Welcome Join Config',
                    description: `Reaja com o emoji específico para configurar a entrada de usuários\n\n📜 Configurar canal\n📢 Configurar mensagem`,
                },
                reactions: ['📜', '📢'],
                pages: {
                    '📜': {
                        embed: {
                            description: 'Mencione ou use o id do canal que deseja definir para mandar a mensagem quando o usuário entrar.'
                        },
                        onMessage: async (message: Message) => {
                            const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(message.content);
                            if (!channel)
                                return message.reply('Você precisa mencionar um canal ou usar o ID.').then(async (m: Message) => await m.delete({ timeout: 3_000 }));

                            const welcomeConfig = ctx.server.getWelcome();
                            welcomeConfig.join.channel = channel.id;
                            await ctx.server.setWelcome(welcomeConfig);
                            return await message.reply(`Sucesso! Você definiu o canal para enviar mensagens de boas-vindas como ${channel}.`);
                        }
                    },
                    '📢': {
                        embed: {
                            description: 'Escreva a mensagem que o usuário irá receber quando entrar no servidor.',
                            fields: [
                                {
                                    name: 'Variáveis disponíveis',
                                    value: "`{user}`, `{username}`, `{user-id}`, `{tag}`, `{discriminator}`, `{guild}`, `{members-count}`, `{avatar-url}`",
                                    inline: true
                                }
                            ]
                        },
                        onMessage: async (message: Message) => {
                            const msg = Placeholders.fromMessage(message.content, message);
                            const welcomeConfig = ctx.server.getWelcome();
                            try {//todo: fix this./// embed: '"test"'
                                welcomeConfig.join.embed = JSON.stringify(message.content);
                            } catch {
                                welcomeConfig.join.embed = `{ "content": "${message.content}" }`;
                            }
                            await ctx.server.setWelcome(welcomeConfig);
                            message.reply(`Sucesso! Você definiu a mensagem de boas-vindas como:`).then((m: Message) => m.delete({ timeout: 3_000 }));
                            return message.channel.send(msg).then((m: Message) => m.delete({ timeout: 3_000 }));
                        }
                    }
                }
            },
        } as IMenuPage;
        const botMessage = await message.channel.send({
            embed: {
                title: 'Welcome Config',
                description: `Reaja com o emoji específico\n\n📥 Entrada\n🔐 Cargo automático ao entrar\n📤 Saída`
            }
        });
        ReactionCollector.menu({ botMessage, user: message, pages });
    }

    public async run({ message }: ICommandParameters) {
        // TODO: config help.
        return await message.reply('Configure o welcome como >config welcome.');
    }
}