const { Router } = require('express');
const routes = Router();
const phoenix = require('../discord/Phoenix').default;

const lang = require('../lang/pt-Br.json');
const t = (key) => {
    const keys = key.split('.');
    let value = lang['website'];
    for (const subKey of keys) {
        value = value[subKey];
    }
    return value;
}

routes.get('/index', (req, res) => {
    return res.render('index', { t });
});

routes.get('/', (req, res) => {
    return res.redirect('/index');
});

routes.get('/invite', (req, res) => {
    return res.redirect(phoenix.INVITE);
});

routes.get('*', (req, res) => {
    return res.send('<h1> Error 404 </h1> <p>Page not found</p>')
});

module.exports = routes;