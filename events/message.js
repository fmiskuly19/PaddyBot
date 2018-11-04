module.exports = async (bot, message) => {

    console.log("new module reached");
    
    if(message.author.bot) return;
    
    if(message.content.indexOf('.') !== 0) return;
  
    //we dont want bot commands in the main channel
    if(message.channel.position == 0){
      return message.reply(`Please only use bot commands in bot channels. Thank you!`);
    }
    
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const currentGuild = message.guild;
    
    if(command === "ping") {
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    }
  
    if(command === "help"){
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
  
      const embed = {
        "title": "Thanks for using Paddy Bot!",
        "description": "Below are a list of commands and how to use them!",
        "color": 51711,
        "timestamp": `${dateTime}`,
        "footer": {
          "icon_url": `${bot.user.displayAvatarURL}`,
          "text": "PaddyBot"
        },
        "fields": [
          {
            "name": "```\n.help```",
            "value": "List of commands"
          },
          {
            "name": "```\n.info```",
            "value": "Information about Paddy Bot"
          },
          {
            "name": "```\n.say 'string'```",
            "value": "Repeats user input"
          },
          {
            "name": "```\n.ping```",
            "value": "Gives ping to server and bot"
          },
          {
            "name": "```\n.kick @user```",
            "value": "Kicks the specified user if author of comment has high enough role"
          },
          {
            "name": "```\n.ban @user```",
            "value": "Bans the specified user if author of comment has high enough role"
          },
          {
            "name": "```\n.egan```",
            "value": "Will tell you if egan is online and what he is doing"
          },
          {
            "name": "```\n.move @user 'channelname'```",
            "value": "Moves user to specified channel name"
          },
          {
            "name": "```\n.stop @user```",
            "value": "Mutes specified user"
          },
          {
            "name": "```\n.status @user```",
            "value": "Gives status of specified user"
          }
        ]
      };
      message.channel.send({embed});
    }
  
    if(command === "info"){
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
  
      const embed = {
        "color": 6143,
        "timestamp": `${dateTime}`,
        "footer": {
          "icon_url": `${bot.user.displayAvatarURL}`,
          "text": "Paddy bot"
        },
        "fields": [
          {
            "name": "Information",
            "value": "PaddyBot is written in javascript using discord.js: a very powerful node.js module"
          },
          {
            "name": "Resources",
            "value": "https://anidiots.guide/ \nhttps://discord.js.org/#/docs/main/stable/general/welcome \nhttps://leovoel.github.io/embed-visualizer/"
          },
          {
            "name": "Github",
            "value": "[Github repo](https://github.com/fmiskuly19/PaddyBot)"
          },
          {
            "name": "Host",
            "value": "[Heroku](https://paddybot.herokuapp.com/)"
          }
        ]
      };
  
      message.channel.send({embed});
    }
    
    if(command === "say") {
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{}); 
      message.channel.send(sayMessage);
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
  
        message.reply(` deleted ${deleteCount} messages from ${message.channel}`);
    }
  
    if(command === "egan") {
  
      let guild = message.guild;
      let egan = guild.members.find(member => member.id === "310638075875295235"); //get egan's member object from guild
  
      if(!egan){
        return message.reply(`Egan is not a member of this guild!`);
      }
  
      //variables to use for embedded message
      let eganAvatar = bot.users.find(user => user.id === "310638075875295235").displayAvatarURL;
      let p = egan.presence;
      let color = (p.status === "online") ? 8978176 : 16711680;
      
      var fields = [{"name": "Status", "value": p.status}];  
        
      if(p.status != "offline"){
        let inGame = (p.game) ? p.game.name.trim() : "No";
        fields.push({"name": "In Game","value": inGame})
        if(p.game){
          fields.push({"name": "Time", "value": "0hrs"});
        }
        let bother = (egan.voiceChannel) ? "Yep" : "Nope";
        fields.push({"name": "Bothering", "value": bother});
      }
  
      const embed = {
        "author": {
          "name": egan.displayName,
          "icon_url": eganAvatar
        },
        "color": color,
        "thumbnail": {
          "url": eganAvatar,
        },
        "fields": fields
      };
  
      await message.channel.send({embed});
    }
  
    if(command === "status") {
      
          let member = message.mentions.members.first();
      
          if(!member){
            return message.reply("Please mention a valid member of this server");
          }
      
          //variables to use for embedded message
          let memberAvatar = bot.users.find(user => user.id === member.id).displayAvatarURL;
          let p = member.presence;
          let color = 
            (p.status === "online") ? 8978176 : 
            (p.status === "offline") ? 16711680 :
            16098851;
          
            var fields = [{"name": "Status", "value": p.status}];  
            
          if(p.status != "offline"){
            let inGame = (p.game) ? p.game.name.trim() : "No";
            fields.push({"name": "In Game","value": inGame})
            if(p.game){
              fields.push({"name": "Time", "value": "0hrs"});
            }
          }
      
          const embed = {
            "author": {
              "name": member.displayName,
              "icon_url": memberAvatar
            },
            "color": color,
            "thumbnail": {
              "url": memberAvatar,
            },
            "fields": fields
          };
      
          await message.channel.send({embed});
    }
  
    if(command === "move"){
      let member = message.mentions.members.first();
      let channelName = args[1];
  
      //make sure we got the proper input
      if(!member){
        return message.reply(`Please mention a valid server member`);
      }
      else if(!channelName || channelName.charAt(1) === '#'){
        return message.reply(`Please mention a valid voice channel!`);
      }
  
      //get guild channels
      let guildChannels = currentGuild.channels;
      let selectedChannel = guildChannels.find(channel => channel.name == channelName);
  
      if(!selectedChannel){
        return message.reply(`${selectedChannel} is not a valid voice channel!`);
      }
      else if(selectedChannel.type != "voice"){
        return message.reply(`That channel is not a voice channel!`)
      }
  
      if(!member.voiceChannel){
        return message.reply(`User must already be connected to a voice channel!`)
      }
  
      member.setVoiceChannel(selectedChannel.id)
        .then(() => message.channel.send(`Moved ${member} to voice channel ${channelName}`));
    } 
  
    if(command === "stop"){
      let member = message.mentions.members.first();
      
      if(!member) 
        return message.reply(`Please mention a valid server member`);
      else if(member.mute){
        return message.reply(`Server member is already muted`);
      }
      
      member.setMute(true);
      await message.channel.send(`${member} was muted`);
    }
}