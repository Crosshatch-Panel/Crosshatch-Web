const Tokens = require('csrf')
const fs = require('fs');
const csrf = new Tokens()
const config = require("../config.json")

const secret = csrf.secretSync()

async function router(app, opts) {
    app.register(require('fastify-formbody'))

    app.get('/', async (request, reply) => {
        let account = request.session.get('account');
        if (!account) return request.session.destroy(() => reply.redirect('/login'));
        reply.redirect("/dashboard")
    })

    app.get('/login', async (request, reply) => {
        const token = csrf.create(secret)
        reply.view("./views/login", { csrftoken: token });
    })

    app.post('/login', async (request, reply) => {
        const body = JSON.parse(JSON.stringify(request.body))
        if (!csrf.verify(secret, body.csrftoken)) return reply.send({ "error": "csrftokenmissmatch" })
        const results = [];
        for (var i = 0; i < config.users.length; i++) {
            if (config.users[i]["username"] == body.username) {
                results.push(config.users[i]);
            }
        }
        if (!results) {
            return reply.redirect("/login?invalid")
        }
        const user = results[0]
        if (user.password != body.password) {
            console.log(1)
            return reply.redirect("/login?invalid")
        }
        console.log(user)
        request.session.set('account', user);
        console.log(2)
        reply.redirect("/dashboard")
    })

    app.get('/logout', async (request, reply) => {
        return request.session.destroy(() => reply.redirect('/login'));
    })
}

module.exports = router;