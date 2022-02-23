module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.guild) return interaction.reply({ content: "My commands may only work in Servers!", ephemeral: true })
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
