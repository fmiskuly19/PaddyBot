// Load up the discord.js library
const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

//faux instance variables

//what is the solution for this? How can I access the current guild without creating global variables
const paddyID = "177562182463127563";

bot.on("ready", () => {
  console.log(`bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

// bot.on("raw", (o) => {
//   console.log(o);
// });

// bot.on("PRESENCE_UPDATE", (packet) => {
//   console.log(`User with ID ${packet.d.user.id} has changed their presence.`);
//   message.channel.send(`User with ID ${packet.d.user.id} has changed their presence.`);
// });

// bot.on("VOICE_STATE_UPDATE", async (packet) => {
//   console.log(`User with ID ${packet.d.member.nick} has caused a voice_state_update.`);
//   await message.channel.send(`User with ID ${packet.d.member.nick} has caused a voice_state_update.`);
// });

bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});


bot.on("message", async message => {
    
  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  }

  if(command === "egan") {
    var currGuild = bot.guilds.find(guild => guild.id === paddyID);
    var egan = currGuild.members.find(member => member.displayName === "poggers").presence.status;
    await message.channel.send(`Egan is ${egan}`);
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "stop"){
    let member = message.mentions.members.first().speaking;
    
    if(member) 
      console.log("Annoying member: ", member);
  } 

  if(command === "move"){
    if(args){
      console.log(args);
      console.log(typeof(args[0]));
    }
    // if(message.mentions.users.size != 1 && message.mentions.users.size != 1){
    //   await message.channel.send(`${message.author}, Please specify the correct arguments for the .move command`);
    //   return;
    // }

    // if(channelType === "voice"){
    //   console.log(typeof(message.mentions.users.first()));
    // }
  } 

  if(command === "stop"){
    let member = message.mentions.members.first().speaking;
    console.log("Annoying member: ", member);
  } 
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Server Owner"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {

    if(!message.member.roles.some(r=>["Server Owner"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

      message.reply(`${message.author.tag} deleted ${deleteCount} messages from ${message.channel}`);
  }
});

bot.login(config.token);