const { Router } = require('express');
const routes = Router();
const fetch = require('node-fetch');
const FormData = require('form-data');
const phoenix = require('../discord/Phoenix').default;
const { isArray } = require('util');
const md5 = require('md5');

const lang = require('./lang/en_US.json');
const { Permissions, Collection } = require('discord.js');
const t = (key) => {
    const keys = key.split('.');
    let value = lang;
    for (const subKey of keys) {
        value = value[subKey];
    }
    return value;
}

const cache = new Collection();

const exchageCode = async(code) => {
    const data = new FormData();
    data.append('client_id', '503239059775422491');
    data.append('client_secret', 'z7kIojXzL_I5WH2jRSCdsHv0nd2RAe-s');
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', 'http://127.0.0.1:3000/api/discord/callback');
    data.append('scope', 'identify');
    data.append('code', code);
    return await fetch('https://discordapp.com/api/oauth2/token', { method: 'POST', body: data }).then(res => res.json())
}
/*
const refreshToken = async (oldToken) => {
    const data = new FormData();
    data.append('client_id', '503239059775422491');
    data.append('client_secret', 'z7kIojXzL_I5WH2jRSCdsHv0nd2RAe-s');
    data.append('grant_type', 'refresh_token');
    data.append('refresh_token', oldToken);
    data.append('redirect_uri', 'http://127.0.0.1:3000/api/discord/callback');
    data.append('scope', 'identify email connections');
    return await fetch('https://discordapp.com/api/oauth2/token', { method: 'POST', body: data }).then(res => res.json())

}*/

routes.get('/index', (req, res) => {
    return res.render('index', { t, user: null });
});

routes.get('/', (req, res) => {
    return res.redirect('index');
});

routes.get('/invite', (req, res) => {
    return res.redirect(phoenix.INVITE);
});

routes.get('/guilds', (req, res) => {
    try {
        const token = req.cookies['token'];
        const { userInfo, guilds } = cache.get(token);
        if (!userInfo || !guilds)
            return res.json({ code: 404, message: 'af' });//todo remover isso
        return res.render('guilds', { userInfo, guilds });
    } catch (error) {
        return res.status(500).json({ code: 500, message: 'error', error: error.toString() })
    }
});

routes.get('/dashboard/:guild/index', (req, res) => {
    const token = req.cookies['token'];
    if (token && cache.has(token)) {
        const { userInfo, guilds } = cache.get(token);
        if (!userInfo || !guilds)
            return res.json({ code: 404, message: 'parece que n existe nd aq' });//todo remover isso
        if(guilds[reqz])
        console.log(userInfo, guilds)
        return res.send('ok');
    }
    return res.redirect(403, '/index');
});

routes.get('/api/discord/callback', async (req, res) => {
    try {
        const code = req.query.code;
        if (!code)
            return res.status(401).json({ error: 'Unauthorized', message: 'You are not allowed to access it.' });

        const info = await exchageCode(code);
        const userInfo = await fetch('https://discordapp.com/api/users/@me', {
            headers: {
                authorization: `${info.token_type} ${info.access_token}`,
            },
        }).then((userResponse) => userResponse ? userResponse.json() : userResponse);
        let guildsInfo = await fetch('https://discordapp.com/api/users/@me/guilds', {
            headers: {
                authorization: `${info.token_type} ${info.access_token}`,
            },
        }).then((guildsResponse) => guildsResponse ? guildsResponse.json() : guildsResponse);
    
        //make one array
        guildsInfo = isArray(guildsInfo) ? guildsInfo : [guildsInfo];
        //todo totalmente provisório
        const encrypt = md5(userInfo.id + code);
        if (cache.has(encrypt)) cache.delete(encrypt);
        cache.set(encrypt, { userInfo, guilds: guildsInfo.filter(g => g.owner || new Permissions(g.permissions).has('MANAGE_GUILD')) });
        return res.cookie('token', encrypt).redirect('../../guilds');
    } catch (error) {
        return res.status(500).json({ code: 500, message: 'error', error: error.toString() })
    }
});

routes.get('*', (req, res) => {
    return res.send('<h1> Error 404 </h1> <p>Page not found</p>')
});

module.exports = routes;