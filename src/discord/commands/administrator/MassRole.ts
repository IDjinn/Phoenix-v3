import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class MassRoleCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'massrole',
            category: 'administrator',
            botPermissionsNeed: ['MANAGE_ROLES'],
            permissionsNeed: ['MANAGE_ROLES']
        });
    }

    public async run({ message, args, phoenixUser }: ICommandParameters) {
        if (args.length === 0)
            return message.reply(phoenixUser.t('commands.massRole.errors.no-role')).catch();
        
        const role = message.mentions.roles.first() || message.guild?.roles.cache.get(args[0]);
        if (!role)
            return message.reply(phoenixUser.t('commands.massRole.errors.invalid-role')).catch();
        
        const op = args[1] ? phoenixUser.t('commands.massRole.operations.' + args[1]) : 'give';
        const members = await Promise.resolve(message.guild?.members.cache.filter(member => member.manageable && !member.roles.cache.has(role.id))
            .map(member => op === 'give' ? member.roles.add(role.id).catch() : member.roles.remove(role.id).catch()));
        return message.reply(phoenixUser.t('commands.massRole.sucess', op, members ? members.length : 0)).catch();
    }
}