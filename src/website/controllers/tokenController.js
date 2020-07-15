const { Collection } = require("discord.js");
const phoenix = require('../../discord/Phoenix').default;
const sessions = new Collection();

module.exports.bypass = (req) => {
    if (!req.cookies)
        return false;
    
    const token = req.cookies['token'];
    if (!sessions.has(token))
        return false;
    
    return true;
}

module.exports.getSession = (req) => {
    return sessions.get(req.cookies['token']);
}

module.exports.setSession = (token, userInfo) => {
    return sessions.set(token, userInfo);
}

module.exports.guildManageable = (req) => {
    if (!req.params)
        return false;
    
    const guild = phoenix.getClient().guilds.cache.get(req.params['guild']);
    if (!guild)
        return false;
    
    const member = guild.members.cache.get(this.getUser(req.query.token).id);
    if (!member)
        return false;
    
    return member.hasPermission('MANAGE_GUILD');
}