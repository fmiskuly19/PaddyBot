const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");

const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 5000

app.use(express.static(__dirname + '/public')); //allow for static content delivery

app.get('/', function(req, res){
  res.send("Paddybot up and running!"); 
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, event.bind(null, bot));
  });
});

bot.commands = [];

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let f = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    //store command in commands array.
    bot.commands.push({name: commandName, f: f});
  });
});

/// catch all raw packets
// bot.on("raw", (output) => {
//   console.log(output);
// });

bot.login(process.env.DISCORD_KEY); //env variable is set through heroku cli to avoid exposing api key to public github repo

//ping server every 5 minutes to avoid the heroku app going idle... is there a better solution for this?
const http = require('http');

setInterval(function(){
  http.get("http://paddybot.herokuapp.com/");
  console.log("Pinged heroku app at ", new Date().toLocaleString());
},300000);