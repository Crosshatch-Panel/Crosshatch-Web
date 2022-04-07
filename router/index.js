const express = require('express')
const router = express.Router();
const settings = require('../settings.json')

router.get('/', async (req, res) => {
    res.render("login");
})

router.get('/test', async (req, res) => {
    res.render("test", { nodes: settings.nodes })
})

router.post('/auth/login', async (req, res) => {
    if (settings.auth.password == req.body.password) {
        req.session.authenticated = true;
        res.redirect('/dashboard')
    } else {
        res.redirect('/?err=INCORRECTPASS')
    }
});

module.exports = router;