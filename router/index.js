const express = require('express')
const router = express.Router();
const settings = require('../settings.json')
const controller = require('../controller')

router.get('/', async (req, res) => {
    res.render("login");
})

router.get('/test', async (req, res) => {
    const images = await controller.listAllImages().catch(error => { res.send(error) })
    res.render("test", { nodes: settings.nodes, total_docker_images: images.length })
})

router.post('/auth/login', async (req, res) => {
    if (settings.auth.password == req.body.password) {
        req.session.authenticated = true;
        if (req.session.redirectTo === "/favicon.ico") return res.redirect('/dashboard')
        if (req.session.redirectTo.includes("ajax")) return res.redirect('/dashboard')
        if (!req.session.redirectTo) return res.redirect('/dashboard')
        res.redirect(req.session.redirectTo)
    } else {
        res.redirect('/?err=INCORRECTPASS')
    }
});

module.exports = router;