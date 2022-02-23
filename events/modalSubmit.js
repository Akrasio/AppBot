const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'modalSubmit',
    async execute(client, modal) {
        let i = -1;
        if (/application(_[\d]+)?/.test(modal.customId)) {
            //            console.log(modal)
            let emb = new MessageEmbed()
                .setAuthor({ name: modal.user.tag + " | " + modal.user.id, iconURL: modal.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setColor("LUMINOUS_VIVID_PINK")
                .setTitle("New App. Submission for: " + modal.customId.toString().split("_")[1]);
            let appQ = [];

            await modal.client.db.get(modal.guild.id + ".apps").then(async app => {
                await app.forEach(async apps => {
                    return apps.question.forEach(async q => {
                        return appQ.push(q)
                    })
                })
            })
            modal.fields.forEach(question => {
                i++
                emb.addField(`${Number(i + 1)}: ${appQ[i]}`, question.value || "No response", true)
            })
            let appLogs = await modal.client.db.get(modal.guild.id + ".apps_log");

            await modal.guild.channels.cache.get(appLogs).send({
                embeds: [
                    emb
                ]
            })
            modal.reply({ content: "Your Application has been submitted successfully!", ephemeral: true })
        }
    }
}