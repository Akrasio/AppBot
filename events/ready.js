module.exports = {
    name: 'ready',
    async execute(client) {
        const status = ["Applications!", "your mod apps!", "mod applications.", "over your apps."];
        setInterval(() => {
            client.user.setActivity(`${status[Math.floor((Math.random() * status.length))]}`, { type: "WATCHING" });
        }, 60000);
        client.user.setActivity(`${status[Math.floor((Math.random() * status.length))]}`, { type: "WATCHING" });
        console.log("Ready: " + client.user.tag)
    }
};