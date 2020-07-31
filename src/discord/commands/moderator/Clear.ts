import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class ClearCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'clear',
            category: 'moderator',
            permissionsNeed: ['MANAGE_MESSAGES'],
            botPermissionsNeed: ['MANAGE_MESSAGES'],
            cooldown: 4_000,
            cooldownType: 'CHANNEL'
        });
    }

    public async run({ args, ctx }: ICommandParameters) {
        if (args.length === 0)
            return await ctx.replyT('commands.clear.errors.no-amount');
        
        const amount = parseInt(args[0]);
        if (isNaN(amount))
            return await ctx.replyT('commands.clear.errors.invalid-amount', amount);
        
        if (amount > 100 || amount < 1)
            return await ctx.replyT('commands.clear.errors.invalid-range');
        
            
        return await ctx.channel.bulkDelete(amount, true).then(messages =>
            ctx.replyT('commands.clear.sucess', messages.size));
    }
}