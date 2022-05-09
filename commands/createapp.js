const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandStringOption().setName("title").setDescription("The name of the application you are creating.").setRequired(true);
OPT2 = new SlashCommandStringOption().setName("questions").setDescription("The questions for the application you are creating. (separate with ' | ')").setRequired(true)
module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('createapp')
            .addStringOption(OPT => OPT2)
            .addStringOption(OPT => OPT1)
            .setDescription('Allows you to create a form in the current server!'),
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("You must have `ADMINISTRATOR` permissions to do this!");
        if (!interaction.client.db.get(interaction.guild.id + ".apps_log")) return interaction.reply("There is no form log set up! Please make sure one has been set up before making forms.");
        const exist = await interaction.client.db.get(interaction.guild.id + ".apps").then(async app => {
            return app?.length || 0
        })
        let questions = interaction.options.getString("questions")
        let q = questions.split("|");
        if (exist >= 4) return interaction.reply("The max amount of Applications a guild can make is **4**")
        if (q.length >= 6) return interaction.reply("Apps can only have a max of 5 questions!");
        if (!interaction.guild.channels.cache.get(await interaction.client.db.get(interaction.guild.id + ".apps_log"))) return interaction.reply("Please set an App Log channel first!");
        await interaction.client.db.push(interaction.guild.id + ".apps", {
            number: Number(exist || 0) + 1,
            name: interaction.options.getString("title"),
            question: q
        });
        return interaction.reply("Successfully created the application!");
    }
}
