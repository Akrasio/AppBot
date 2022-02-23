const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
module.exports = {
    data:
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong'),
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle(`Pong!`)
            .setFooter({text: `${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL()})
            .setColor("RANDOM")
            .addField("API Latency", `${Math.round(interaction.client.ws.ping)}ms`)
        interaction.reply({ embeds: [embed] })

    }
};
