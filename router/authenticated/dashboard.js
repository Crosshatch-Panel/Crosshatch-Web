const express = require('express');
const router = express.Router();
const settings = require('../../settings.json');

const controller = require('../../controller')

router.get('/dashboard', async (req, res) => {
    res.render("dashboard")
});

router.get('/dashboard/ajax', async (req, res) => {
    const containers = await controller.listAll().catch(error => { res.send(error) })

    res.json({ data: containers })
});

router.get('/dashboard/container/:node/:id', async (req, res) => {
    if (!req.params.node) return res.send("No node specified")
    if (!req.params.id) return res.send("No container specified")
    const container = await controller.getInfo(req.params.node, req.params.id).catch(error => { return res.send("Invalid container ID") })
    res.render("container_overview", { container_info: container })
});

router.get('/dashboard/container/:node/:id/ajax', async (req, res) => {
    if (!req.params.node) return res.send("No node specified")
    if (!req.params.id) return res.send("No container specified")
    const container = await controller.getInfo(req.params.node, req.params.id).catch(error => { return res.send("Invalid container ID") })
    res.json({ container_info: container })
});

router.get('/dashboard/container/:node/:id/exec', async (req, res) => {
    if (!req.params.node) return res.send("No node specified")
    if (!req.params.id) return res.send("No container specified")
    const container = await controller.getInfo(req.params.node, req.params.id).catch(error => { return res.send("Invalid container ID") })
    const node_name = settings.nodes.find(nodes => nodes.name === req.params.node)
    if (!node_name) return res.send("Invalid node")
    function removeHttp(url) {
        return url.replace(/^https?:\/\//, '');
    }

    let wsurl = removeHttp(node_name.url)
    res.render("container_exec", { container_info: container, wsurl: wsurl })
})

router.post('/dashboard/container/all/actions/:action', async (req, res) => {
    let STATUS;
    if (req.params.action == "start") {
        STATUS = "STARTED"
        await controller.startAllContainers().catch(err => { return res.send(err) })
    } else if (req.params.action == "stop") {
        STATUS = "STOPPED"
        await controller.stopAllContainers().catch(err => { return res.send(err) })
    } else if (req.params.action == "kill") {
        STATUS = "KILLED"
        await controller.killAllContainers().catch(err => { return res.send(err) })
    }
    return res.json({ "status": STATUS })
});

router.post('/dashboard/container/:node/:id/actions/start', async (req, res) => {
    if (!req.params.node) return res.send("No node specified")
    if (!req.params.id) return res.send("No container specified")
    await controller.startContainer(req.params.node, req.params.id).catch(err => { return res.send("Invalid container ID") })
    return res.json({ "status": "STARTED" })
});

router.post('/dashboard/container/:node/:id/actions/stop', async (req, res) => {
    if (!req.params.node) return res.send("No node specified")
    if (!req.params.id) return res.send("No container specified")
    await controller.stopContainer(req.params.node, req.params.id).catch(err => { return res.send("Invalid container ID") })
    return res.json({ "status": "STOPPED" })
});

router.post('/dashboard/container/:node/:id/actions/kill', async (req, res) => {
    if (!req.params.node) return res.send("No node specified")
    if (!req.params.id) return res.send("No container specified")
    await controller.killContainer(req.params.node, req.params.id).catch(err => { return res.send("Invalid container ID") })
    return res.json({ "status": "KILLED" })
});

module.exports = router;