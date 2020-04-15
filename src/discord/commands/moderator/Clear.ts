import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";
import AsyncLock from 'async-lock';
const Lock = new AsyncLock();

export default class ClearCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'clear',
            category: 'moderator',
            permissionsNeed: ['MANAGE_MESSAGES'],
            botPermissionsNeed: ['MANAGE_MESSAGES']
        });
    }

    public run({ message, args, phoenixUser }: ICommandParameters) {
        if (args.length === 0)
            return message.reply(phoenixUser.t('commands.clear.errors.no-amount'));
        
        const amount = parseInt(args[0]);
        if (isNaN(amount))
            return message.reply(phoenixUser.t('commands.clear.errors.invalid-amount', amount));
        
        if (amount > 100 || amount < 1)
            return message.reply(phoenixUser.t('commands.clear.errors.invalid-range'));
        
        /*
         * Usamos lock para bloquear outras threads executar o método que estamos usando
         * Assim, quando o comando for executado mais de uma vez de forma muito rápida
         * Garantimos que iremos executar apenas uma vez, por vez. Isso irá evitar muitos
         * Requests e sobrecarga no bot.
         */

        if (Lock.isBusy(message.channel.id))
            return;
        
        return Lock.acquire(message.channel.id, async () => {
            return message.channel.bulkDelete(amount, true).then(messages => message.reply(phoenixUser.t('commands.clear.sucess', messages.size)));
        });
    }
}