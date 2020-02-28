const { Router } = require('express');
const routes = Router(); 

routes.get('/teste', (req, res) => {
    res.render('index'); 
});

module.exports = routes;