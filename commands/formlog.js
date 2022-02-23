const { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandStringOption().setName("action").setDescription("The action to do.").setRequired(true).addChoice("delete", "delete").addChoice("set", "set");
OPT2 = new SlashCommandChannelOption().setName("channel").setDescription("The value to set or use.").setRequired(false);

module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('formlog')
            .addStringOption(OPT => OPT1)
            .addChannelOption(OPT => OPT2)
            .setDescription('Allows you to manage form log in the current server!'),
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("You must have `ADMINISTRATOR` permissions to do this!");
        if (interaction.options.getString("action") == "set") {
            let channel = interaction.options.getChannel("channel");
            if (!channel) return interaction.reply("Please provide a proper channel!")
            if ((await interaction.client.db.get(interaction.guild.id + ".apps_log")) == channel.id) return interaction.reply("That channel is already set as the formlog!")
            await interaction.client.db.set(interaction.guild.id + ".apps_log", channel.id);
            interaction.reply(`Set the form channel to ${channel}`);
            return;
        }
        if (interaction.options.getString("action") == "delete") {
            await interaction.client.db.delete(interaction.guild.id + ".apps_log");
            interaction.reply(`Set the form channel to ${channel}`);
            return;
        }
    }
}