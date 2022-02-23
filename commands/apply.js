const { Modal, TextInputComponent, showModal } = require('discord-modals') // Now we extract the showModal method
const { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandBooleanOption } = require('@discordjs/builders');
OPT2 = new SlashCommandNumberOption().setName("application").setDescription("The number of the application you are applying for.");
module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('apply')
            .addNumberOption(OPT => OPT2)
            .setDescription('Allows you to apply in the current server!'),
    async execute(interaction) {
        let numbers = interaction.options.getNumber("application") || 1;
        await interaction.client.db.get(interaction.guild.id + ".apps").then(async app => {
            if (!app || app.size < numbers) return interaction.reply("No application found!");
            app.forEach(async apps => {
                if (app.size < numbers) return interaction.reply("No application found!");
                if (apps.number == numbers) {
                    if (!app) return interaction.reply("No application found!");
                    var i = 0;
                    const modal = new Modal() // We create a Modal
                        .setCustomId('application_' + apps.name)
                        .setTitle('Application Form for: ' + apps.name);
                    if (apps.question.length >= 1 && i < apps.question.length) {
                        await apps.question.forEach(async q => {
                            i++
                            modal.addComponents(
                                new TextInputComponent() // We create a Text Input Component
                                    .setCustomId('question_' + i)
                                    .setLabel(q)
                                    .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                                    .setMinLength(1)
                                    .setMaxLength(100)
                                    .setPlaceholder('Your response here...')
                                    .setRequired(true) // If it's required or not
                            )
                        })

                    }
                    showModal(modal, {
                        client: interaction.client, // This method needs the Client to show the Modal through the Discord API.
                        interaction: interaction // This method needs the Interaction to show the Modal with the Interaction ID & Token.
                    })
                }
            })
        })
    }
}
