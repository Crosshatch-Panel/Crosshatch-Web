const fs = require('fs');
const path = require("path");
const Tokens = require('csrf')
const csrf = new Tokens()

const secret = csrf.secretSync()

async function router(app, opts) {
    app.get('/', async (request, reply) => {
        const account = request.session.get('account');
        if (!account) return request.session.destroy(() => reply.redirect('/login'));
        const token = csrf.create(secret);
        reply.view("./views/dashboard", { csrftoken: token, account: account });
    });
}

module.exports = router;