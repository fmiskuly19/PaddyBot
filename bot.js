const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");

// go through events and bind events to module
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    //bind events to module
    bot.on(eventName, event.bind(null, bot));
  });
});

// store commands in bot object
bot.commands = [];

// loop through commands and store them in bot object
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let mod = require(`./commands/${file}`);
    //store command in commands array.
    bot.commands.push(mod);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Loaded command ${commandName}`);
  });
});

bot.login(process.env.DISCORD_KEY); //env variable is set through heroku cli to avoid exposing api key to public github repo