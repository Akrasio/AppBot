const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Show or modify server settings!')
        .addStringOption(opt =>
            opt.setName("options")
                .setDescription("show settings or pick a setting to modify")
                .addChoice("show", "show")
                .addChoice("logs", "logs")
                .addChoice("modrole", "modrole")
                .addChoice("approle", "approle")
                .setRequired(true))
        .addChannelOption(opt =>
            opt.setName("channel")
                .setDescription("Channel to set for logs"))
        .addStringOption(opt =>
            opt.setName("clear")
                .setDescription("Clear the setting.")
                .addChoice("confirm", 'confirm'))
        .addRoleOption(opt =>
            opt.setName("role")
                .setDescription("Role to set for modrole.")),
    async execute(inter) {
        let client = inter.client;

        try {
            if (!inter.memberPermissions.has(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES"])) return inter.reply("You lack the proper permissons to do this!")
            let ops = [
                'show',
                'modrole',
                'logs',
                'approle'
            ];
            let disabled = ":x: Disabled"
            let enabled = ":white_check_mark: Enabled"
            let args = inter.options.getString("options");
            let argZ = inter.options.getInteger("amount");
            let argX = inter.options.getString("punishment")
            let booP = inter.options.getString("set")
            let bruh = new Discord.MessageEmbed()
                .setTitle('**Applications | Config**')
                .setDescription(`
    **The Options are listed below:**
    config ${ops.join("\n config ")}
    `)
                .setColor("#FF0000")
                .setThumbnail(inter.user.displayAvatarURL({ dynamic: true }))
                .setFooter(inter.guild.name, inter.guild.iconURL())
            if (!args) return inter.reply({ embeds: [bruh] });
            switch (args) {
                case "show":
                    let modroles = await client.db.get(`${inter.guild.id}.modrole`)
                    let approles = await client.db.get(`${inter.guild.id}.approle`)
                    let mlogs = await client.db.get(`${inter.guild.id}.apps_log`)

                    if (approles === null) approles = disabled
                    if (approles !== null && approles !== disabled) {
                        approles = inter.guild.roles.cache.get(approles)
                        if (!approles) approles = disabled
                    }
                    if (mlogs === null) mlogs = disabled
                    if (mlogs !== null && mlogs !== disabled) {
                        mlogs = client.channels.cache.get(mlogs)
                        if (!mlogs) mlogs = disabled
                    }
                    if (modroles === null) modroles = disabled
                    if (modroles !== null && modroles !== disabled) {
                        modroles = inter.guild.roles.cache.get(modroles)
                        if (!modroles) modroles = disabled
                    }
                    let show = new Discord.MessageEmbed()
                        .setTitle("**Applications | Config**")
                        .setThumbnail(inter.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: inter.guild.name, iconURL: inter.guild.iconURL() })
                        .addField("App Logs", mlogs.toString() || disabled, true)
                        .addField("Applicant Role", `${approles}` || disabled, true)
                        .addField("Mod Role", `${modroles}` || disabled, true)
                        .setColor("GREEN")
                    return inter.reply({ embeds: [show] })
                    break;
                case "logs":
                    let channel = inter.options.getChannel("channel")
                    if (inter.options.getString("clear") == "confirm") {
                        await client.db.delete(`${inter.guild.id}.apps_log`)
                        return inter.reply("Removed the logs channel!")
                    }
                    if (!channel) return inter.reply(":x: | **Mention The channel**")
                    if (channel.guild.id !== inter.guild.id || channel.type != "GUILD_TEXT") return inter.reply(":x: | **That channel is not from this server or isnt a text channel!**")
                    await channel.send("**Application logs Channel**")
                    await client.db.set(`${inter.guild.id}.apps_log`, channel.id)
                    return inter.reply("**The logs channel has been set to " + channel + "**")
                    break;
                case "modrole":
                    let modrole = inter.options.getRole("role");
                    if (inter.options.getString("clear") == "confirm") {
                        await client.db.delete(`${inter.guild.id}.modrole`)
                        return inter.reply("Removed the role as Accepted Mod-role!")
                    }
                    if (!modrole) return inter.reply(":x: | **There was no Accepted Mod role given!**")
                    if (!inter.guild.roles.cache.get(modrole.id)) return inter.reply(":x: | **There was no role found!**");
                    await client.db.set(`${inter.guild.id}.modrole`, modrole.id)
                    return inter.reply("**The Accepted-Mod role has been set to " + modrole.name + "**")
                    break;
                case "approle":
                    let approle = inter.options.getRole("role");
                    if (inter.options.getString("clear") == "confirm") {
                        await client.db.delete(`${inter.guild.id}.approle`)
                        return inter.reply("Removed the role as app role!")
                    }
                    if (!approle) return inter.reply(":x: | **There was no applicant role given!**")
                    if (!inter.guild.roles.cache.get(approle.id)) return inter.reply(":x: | **There was no role found!**");

                    await client.db.set(`${inter.guild.id}.approle`, approle.id)
                    return inter.reply("**The applicant role has been set to " + approle.name + "**")
                    break;
            }
        } catch (err) {
            console.log("||||| ERROR: " + err)
            return inter.reply("An Error Occurred!");
        }
    },
};
