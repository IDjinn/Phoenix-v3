import AbstractCommand, { ICommandParameters } from "../../structures/AbstractCommand";

export default class MassRoleCommand extends AbstractCommand {
    constructor() {
        super({
            name: 'massrole',
            category: 'administrator',
            cooldownType: 'GUILD',
            cooldown: 7_000,
            botPermissionsNeed: ['MANAGE_ROLES'],
            permissionsNeed: ['MANAGE_ROLES']
        });
    }

    public async run({ ctx }: ICommandParameters) {
        const role = ctx.getRole();
        const operation = ctx.shiftArgs();
        const op = operation ? ctx.t('commands.massRole.operations.' + operation) : 'give';
        const members = await Promise.resolve(ctx.guild.members.cache.filter(member => member.manageable && !member.roles.cache.has(role.id))
            .map(member => op === 'give' ? member.roles.add(role.id).catch() : member.roles.remove(role.id).catch()));
        return ctx.replyT('commands.massRole.sucess', op, members ? members.length : 0).catch();
    }
}