const { Router } = require('express');
const routes = Router();
const fetch = require('node-fetch');
const FormData = require('form-data');
const phoenix = require('../discord/Phoenix').default;
const { isArray } = require('util');
const md5 = require('md5');
const config = require('../../../config.json');

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
const errors = {
    notFound: {
        error: {
            code: 404,
            title: 'Not Found',
            message: 'The page what you\'ve looking for wasn\'t found.'
        }
    },
    forbidden: {
        error: {
            code: 403,
            title: 'Forbidden',
            message: 'You need permission to acess this page.'
        }
    },
}

const cache = new Collection();

const exchageCode = async (code) => {
    const data = new FormData();
    data.append('client_id', '503239059775422491');
    data.append('client_secret', config.secret);
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
    data.append('client_secret', 'secret');
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
            return res.json({ code: 404, message: 'af' });
        console.log(guilds);
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
            return res.render('error', errors.notFound);
        if (guilds) {
            //ok
        }
    }
    return res.status(403).render('error', errors.forbidden);
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
        let guildsInfo = [...await fetch('https://discordapp.com/api/users/@me/guilds', {
            headers: {
                authorization: `${info.token_type} ${info.access_token}`,
            },
        }).then((guildsResponse) => guildsResponse ? guildsResponse.json() : guildsResponse)];

        cache.set(code, { userInfo, guilds: guildsInfo.filter(g => g.owner || new Permissions(g.permissions).has('MANAGE_GUILD')) });
        return res.cookie('token', code).redirect('../../guilds');
    } catch (error) {
        return res.status(500).json({ code: 500, message: 'error', error: error.toString() })
    }
});

routes.get('*', (req, res) => {
    return res.render('error', errors.notFound);
});

module.exports = routes;