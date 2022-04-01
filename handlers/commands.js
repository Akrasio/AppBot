const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
    const cmds = fs.readdirSync("./commands/").filter(f => f.split(".").pop() === "js");

    const commands = [];

    for (const file of cmds) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    // When the client is ready, this only runs once
    client.once('ready', () => {
        // Registering the commands in the client
        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);
        (async () => {

            try {
                if (process.env.slashGlobal == true || !process.env.testGuildID) {
                     await rest.put(
                         Routes.applicationCommands(client.user.id), {
                         body: commands
                     },
                    );
                    console.log('Loaded Slash Commands (GLOBAL)');
                } else {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, process.env.testGuildID), {
                        body: commands
                    },
                    );
                    console.log('Loaded Slash Commands (DEVELOPMENT)');
                }
            } catch (e) { console.error(e); }
        })();
    });

};
