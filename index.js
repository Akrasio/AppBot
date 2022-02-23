const { Client, Collection } = require('discord.js');
const client = new Client({ intents: ["GUILDS"] });
const config = require("./config/config");
const discordModals = require('discord-modals');
const { Database } = require("quickmongo");
//==============================================
client.db = new Database(config.mongo);
client.config = config;
client.commands = new Collection();
discordModals(client);

["events", "commands"]
  .filter(Boolean)
  .forEach(h => {
    require(`./handlers/${h}`)(client);
  });

process.on("uncaughtException", (err)=>{
  console.log(err.message)
})
process.on("unhandledRejection", (err)=>{
  console.log(err.message)
})
client.login(config.token)
