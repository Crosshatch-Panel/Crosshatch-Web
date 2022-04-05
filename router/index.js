const Tokens = require('csrf')
const fs = require('fs');
const csrf = new Tokens()

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
        reply.view("./views/login", { csrftoken: token, error: "" });
    })

    app.post('/login', async (request, reply) => {
        console.log(request.body)
        const body = JSON.parse(request.body)
        if (!csrf.verify(secret, body.csrftoken)) return reply.send({ "error": "csrftokenmissmatch" })
        const results = [];
        for (var i = 0; i < obj.list.length; i++) {
            if (obj.list[i]["username"] == body.username) {
                results.push(obj.list[i]);
            }
        }
        if (!results) {
            return reply.redirect("/login?invalid")
        }
        const user = results[0]
        if (user.password != body.password) {
            return reply.redirect("/login?invalid")
        }
        request.session.set('account', user);
        reply.redirect("/dashboard")
    })

    app.get('/logout', async (request, reply) => {
        return request.session.destroy(() => reply.redirect('/login'));
    })
}

module.exports = router;