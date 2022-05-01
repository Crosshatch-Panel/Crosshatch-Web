const axios = require('axios');
const settings = require('./settings.json');

module.exports = {
    listAll: async () => {
        return new Promise(async (resolve, reject) => {
            let containers = []
            for (let i = 0; i < settings.nodes.length; i++) {
                const res = await axios.get(`${settings.nodes[i].url}/containers`, {
                    headers: {
                        'password': settings.nodes[i].password
                    }
                });
                for (let b = 0; b < res.data.length; b++) {
                    containers.push({ "Id": res.data[b].Id, "Name": res.data[b].Names[0].replace("/", ""), "Node": settings.nodes[i].name, "Image": res.data[b].Image, "State": res.data[b].State, "Status": res.data[b].Status, "Uptime": res.data[b].Uptime })
                }
            }
            resolve(containers)
        });
    },
    listAllImages: async () => {
        return new Promise(async (resolve, reject) => {
            let images
            for (let i = 0; i < settings.nodes.length; i++) {
                const res = await axios.get(`${settings.nodes[i].url}/images`, {
                    headers: {
                        'password': settings.nodes[i].password
                    }
                });
                images = res.data
            }
            resolve(images)
        });
    },
    getInfo: async (node, id) => {
        return new Promise(async (resolve, reject) => {
            const node_name = settings.nodes.find(nodes => nodes.name === node)
            if (!node_name) return reject("Node not found")
            const res = await axios.get(`${node_name.url}/container/${id}`, {
                headers: {
                    'password': node_name.password
                }
            });
            res.data.container_info.Node = node_name
            res.data.container_info.Name = res.data.container_info.Name.replace("/", "")
            resolve(res.data.container_info)
        });
    },
    startContainer: async (node, id) => {
        return new Promise(async (resolve, reject) => {
            const node_name = settings.nodes.find(nodes => nodes.name === node)
            if (!node_name) return reject("Node not found")
            const res = await axios.get(`${node_name.url}/container/${id}/actions/start`, {
                headers: {
                    'password': node_name.password
                }
            });
            if (res.data.status === "STARTED") {
                resolve(true)
            } else {
                reject(res.data.status)
            }
        })
    },
    stopContainer: async (node, id) => {
        return new Promise(async (resolve, reject) => {
            const node_name = settings.nodes.find(nodes => nodes.name === node)
            if (!node_name) return reject("Node not found")
            const res = await axios.get(`${node_name.url}/container/${id}/actions/stop`, {
                headers: {
                    'password': node_name.password
                }
            });
            if (res.data.status === "STOPPED") {
                resolve(true)
            } else {
                reject(res.data.status)
            }
        })
    },
    killContainer: async (node, id) => {
        return new Promise(async (resolve, reject) => {
            const node_name = settings.nodes.find(nodes => nodes.name === node)
            if (!node_name) return reject("Node not found")
            const res = await axios.get(`${node_name.url}/container/${id}/actions/kill`, {
                headers: {
                    'password': node_name.password
                }
            });
            if (res.data.status === "KILLED") {
                resolve(true)
            } else {
                reject(res.data.status)
            }
        })
    },
    startAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < settings.nodes.length; i++) {
                const res = await axios.get(`${settings.nodes[i].url}/container/all/actions/start`, {
                    headers: {
                        'password': settings.nodes[i].password
                    }
                });
                if (res.data.status === "STARTED") {
                    resolve(true)
                } else {
                    reject(res.data.status)
                }
            }
        })
    },
    stopAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < settings.nodes.length; i++) {
                const res = await axios.get(`${settings.nodes[i].url}/container/all/actions/stop`, {
                    headers: {
                        'password': settings.nodes[i].password
                    }
                });
                if (res.data.status === "STOPPED") {
                    resolve(true)
                } else {
                    reject(res.data.status)
                }
            }
        })
    },
    killAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < settings.nodes.length; i++) {
                const res = await axios.get(`${settings.nodes[i].url}/container/all/actions/kill`, {
                    headers: {
                        'password': settings.nodes[i].password
                    }
                });
                if (res.data.status === "KILLED") {
                    resolve(true)
                } else {
                    reject(res.data.status)
                }
            }
        })
    },
}