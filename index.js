const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 });
const config = require("./config/config");
const discordModals = require('discord-modals');
const fs = require('fs');
const { Database } = require("quickmongo");
const mongoose = require("mongoose");
const colors = require("colors");
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

client.login(config.token)
