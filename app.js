const log = require('./functions/logger')
const axios = require('axios').default;
const { textSync } = require('figlet');
const chalk = require('chalk');
const fastify = require('fastify');
const app = fastify({ logger: true });
const session = require('@fastify/session');
const path = require('path')

const config = require("./config.json")

app.register(require('fastify-cookie'), {
    secret: config.web.secret, // for cookies signature
    parseOptions: {}     // options for parsing cookies
});

app.register(session, {
    secret: config.web.secret,
    resave: true,
    saveUninitialized: true,
});

app.register(require("point-of-view"), {
    engine: {
        ejs: require("ejs"),
    },
});

app.register(require('fastify-static'), {
    root: path.join(__dirname, 'static'),
    prefix: '/static/', // optional: default '/'
})

app.register(require('./router/index'), {
    prefix: '/'
})

app.register(require('./router/authenticated'), {
    prefix: '/dashboard'
})

app.register(require('fastify-formbody'))

axios.get('https://api.github.com/repos/JamieGrimwood/Crosshatch/releases/latest').then(function (response) {
    if (response.data.tag_name === "0.0.2") {
        console.log(chalk.cyanBright(textSync('Crosshatch', { horizontalLayout: 'fitted' })));
        console.log(`${chalk.yellow.bold('#=============================')}${chalk.grey.bold('[')} ${chalk.cyanBright.bold('Crosshatch')} ${chalk.grey.bold(']')}${chalk.yellow.bold('=============================#')}`)
        console.log(`${chalk.yellow.bold('#')}                          ${chalk.magenta.bold('Created by: Jamie09__')}                         ${chalk.yellow.bold('#')}`);
        console.log(`${chalk.yellow.bold('#')}                   ${chalk.green(`You are running an up to date version!`)}               ${chalk.yellow.bold('#')}`);
        console.log(`${chalk.yellow.bold('#')}                          ${chalk.grey.bold(`Running on port ${config.web.port}`)}                          ${chalk.yellow.bold('#')}`);
        console.log(chalk.yellow.bold('#========================================================================#'));
    } else {
        console.log(chalk.cyanBright(textSync('Crosshatch', { horizontalLayout: 'fitted' })));
        console.log(`${chalk.yellow.bold('#=============================')}${chalk.grey.bold('[')} ${chalk.cyanBright.bold('Crosshatch')} ${chalk.grey.bold(']')}${chalk.yellow.bold('=============================#')}`)
        console.log(`${chalk.yellow.bold('#')}                          ${chalk.magenta.bold('Created by: Jamie09__')}                         ${chalk.yellow.bold('#')}`);
        console.log(`${chalk.yellow.bold('#')}          ${chalk.red(`You are running an out of date version of crosshatch!`)}         ${chalk.yellow.bold('#')}`);
        console.log(`${chalk.yellow.bold('#')}                     ${chalk.red(`Please update at the link below:`)}                   ${chalk.yellow.bold('#')}`);
        console.log(`${chalk.yellow.bold('#')}          ${chalk.red(`https://github.com/JamieGrimwood/Crosshatch/releases/`)}         ${chalk.yellow.bold('#')}`);
        console.log(`${chalk.yellow.bold('#')}                          ${chalk.grey.bold(`Running on port ${config.web.port}`)}                          ${chalk.yellow.bold('#')}`);
        console.log(chalk.yellow.bold('#========================================================================#'));
    }
})

app.listen(config.web.port).then(() => {
    log.web(`Crosshatch is listening on port ${config.web.port}.`)
})

app.ready().then(async () => {
    log.web("The dashboard has fully started!")
    console.log(app.printRoutes())
}, (err) => {
    log.error(err)
})