const { Client, Collection } = require('discord.js');
const client = new Client({ intents: ["GUILDS"] });
const config = require("./config/config");
const discordModals = require('discord-modals');
const { Database } = require("quickmongo");
//==============================================
client.db = new Database(process.env.MONGO || config.MONGO);
client.config = config;
client.commands = new Collection();
discordModals(client);
["events", "commands"]
  .filter(Boolean)
  .forEach(h => {
    require(`./handlers/${h}`)(client);
  });

process.on("uncaughtException", (err) => {
  console.log(err.message)
})
process.on("unhandledRejection", (err) => {
  console.log(err.message)
})
client.once("ready", async () => {
  const data = await client.commands.map(cmds => { return [cmds.data.name, cmds.data.description] });
  client.data = data;
  require("./web/index")(client)
});
client.login(process.env.TOKEN || config.TOKEN)