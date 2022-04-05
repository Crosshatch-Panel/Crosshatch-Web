const path = require("path");
const fs = require('fs')

async function router(app, opts) {
    app.addHook('preHandler', async (request, reply) => {
        const account = request.session.get('account');
        if (!account) return request.session.destroy(() => reply.redirect('/login'));
        const user = await db.getUser(account.email)
        if (!user) return request.session.destroy(() => reply.redirect('/login'));
    })

    fs.readdirSync(path.join(`${__dirname}/authenticated`))
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
            app.register(require(`${__dirname}/authenticated/${file}`));
        });
}

module.exports = router;