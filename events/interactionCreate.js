const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.guild) return interaction.reply({ content: "My commands may only work in Servers!", ephemeral: true })
        if (interaction.isButton()) {
            if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply("You lack Server Manager permission!");
            if (interaction.customId.match(/(?:formAccept_\d+)/g)) {
                let mrole = await client.db.get(`${interaction.guild.id}.modrole`);
                let arole = await client.db.get(`${interaction.guild.id}.approle`);
                let ureg = interaction.customId.match(/(?:formAccept_\d+)/g).toString().split("_")[1]
                const button = new MessageButton()
                    .setCustomId(interaction.customId)
                    .setLabel('Accepted!')
                    .setStyle('SUCCESS')
                    .setDisabled(true);
                const row = new MessageActionRow()
                    .addComponents(button);
                await interaction.guild.members.fetch(ureg).then(async (member) => {
                    if (mrole && arole) {
                        await member.roles.add(mrole);
                        await member.roles.remove(arole)
                        return interaction.update({ content: `Accepted and set their roles if there were roles set up!`, components: [row] });
                    }
                    return interaction.update({ content: `Accepted this appication!`, components: [row] });
                })
            } else if (interaction.customId.match(/(?:formDeny_\d+)/g)) {
                let ureg = interaction.customId.match(/(?:formDeny_\d+)/g).toString().split("_")[1]
                let arole = await client.db.get(`${interaction.guild.id}.approle`);
                const button2 = new MessageButton()
                    .setCustomId(interaction.customId)
                    .setLabel('Denied!')
                    .setStyle('DANGER')
                    .setDisabled(true);
                const row = new MessageActionRow()
                    .addComponents(button2);
                await interaction.guild.members.fetch(ureg).then(async (member) => {
                    if (arole) {
                        await member.roles.remove(arole)
                        return interaction.update({ content: `Denied the application!`, components: [row] });

                    }
                    return interaction.update({ content: `Denied the application!`, components: [row] });
                })
            }
        }
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            if (error) console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }
};
