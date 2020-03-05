const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const phoenix = require('../discord/Phoenix').default;

class Website {
    constructor() {
        this.app = express();
        this.app.set('port', phoenix.getConfig().website.port);
        this.app.set('views', `${__dirname}/views`);
        this.app.set('view engine', 'ejs');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use('/public', express.static(`${__dirname}/public`, { maxAge: 7 * 24 * 60 * 60 * 1000 }));
        this.app.use(routes);
        this.app.listen(this.app.get('port'), () => console.log('website ready'));
    }
}

const website = new Website();

module.exports = website;