import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import Phoenix from "../../Phoenix";
import { MessageEmbed } from "discord.js";

export default class ReloadCommand extends AbstractCommand{
    constructor() {
        super({
            name: 'reload',
            onlyOwner: true,
            category: 'owner',
            subCommands: [
                {methodName: 'commandController',methodAliases: ['command', 'commands']},
                {methodName: 'eventController',methodAliases: ['event', 'events']},
                {methodName: 'phoenixUserController',methodAliases: ['pusers', 'phoenixuser', 'phoenixusers']},
                {methodName: 'serverController',methodAliases: ['server', 'servers']},
                {methodName: 'textController',methodAliases: ['text', 'texts']},
            ]
        });
    }

    public commandController({ message }: ICommandParameters) {
        let destroyTime = Date.now();
        Phoenix.getCommandController().destroy();
        destroyTime = Date.now() - destroyTime;
        let initTime = Date.now();
        Phoenix.getCommandController().init();
        initTime = Date.now() - initTime;
        return message.channel.send(new MessageEmbed().setDescription(`Sucess, destroy in ${destroyTime}ms and init in ${initTime}ms`));
    }
    public eventController({ message }: ICommandParameters) {
        let destroyTime = Date.now();
        Phoenix.getEventController().destroy();
        destroyTime = Date.now() - destroyTime;
        let initTime = Date.now();
        Phoenix.getEventController().init();
        initTime = Date.now() - initTime;
        return message.channel.send(new MessageEmbed().setDescription(`Sucess, destroy in ${destroyTime}ms and init in ${initTime}ms`));
        
    }
    public phoenixUserController({ message }: ICommandParameters) {
        let destroyTime = Date.now();
        Phoenix.getPhoenixUserController().destroy();
        destroyTime = Date.now() - destroyTime;
        let initTime = Date.now();
        Phoenix.getPhoenixUserController().init();
        initTime = Date.now() - initTime;
        return message.channel.send(new MessageEmbed().setDescription(`Sucess, destroy in ${destroyTime}ms and init in ${initTime}ms`));
        
    }
    public serverController({ message }: ICommandParameters) {
        let destroyTime = Date.now();
        Phoenix.getServerController().destroy();
        destroyTime = Date.now() - destroyTime;
        let initTime = Date.now();
        Phoenix.getServerController().init();
        initTime = Date.now() - initTime;
        return message.channel.send(new MessageEmbed().setDescription(`Sucess, destroy in ${destroyTime}ms and init in ${initTime}ms`));
        
    }
    public textController({ message }: ICommandParameters) {
        let destroyTime = Date.now();
        Phoenix.getTextController().destroy();
        destroyTime = Date.now() - destroyTime;
        let initTime = Date.now();
        Phoenix.getTextController().init();
        initTime = Date.now() - initTime;
        return message.channel.send(new MessageEmbed().setDescription(`Sucess, destroy in ${destroyTime}ms and init in ${initTime}ms`));
        
    }

    public run({ message}:ICommandParameters) {
        let destroyMessage = '';
        let initMessage = '';
        let time = Date.now();
        Phoenix.getCommandController().destroy();
        destroyMessage += `CommandController ${Date.now() - time}ms\n`;
        time = Date.now();
        Phoenix.getPhoenixUserController().destroy();
        destroyMessage += `PhoenixUserController ${Date.now() - time}ms\n`;
        time = Date.now();
        Phoenix.getServerController().destroy();
        destroyMessage += `ServerController ${Date.now() - time}ms\n`;
        time = Date.now();
        Phoenix.getTextController().destroy();
        destroyMessage += `TextController ${Date.now() - time}ms\n`;
        time = Date.now();
        
        Phoenix.getCommandController().init();
        initMessage += `TextController ${Date.now() - time}ms\n`;
        time = Date.now();
        Phoenix.getPhoenixUserController().init();
        initMessage += `PhoenixUserController ${Date.now() - time}ms\n`;
        time = Date.now();
        Phoenix.getServerController().init();
        initMessage += `ServerController ${Date.now() - time}ms\n`;
        time = Date.now();
        Phoenix.getTextController().init();
        initMessage += `TextController ${Date.now() - time}ms\n`;
        time = Date.now();
        return message.channel.send(new MessageEmbed().addField(`Destroy`, destroyMessage, true).addField('Init', initMessage, true));
    }
}