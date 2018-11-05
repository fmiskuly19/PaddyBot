module.exports.run = async (bot, message,args) => { 
    let guild = message.guild;
    let egan = guild.members.find(member => member.id === "310638075875295235"); //get egan's member object from guild

    if(!egan){
      return message.reply(`Egan is not a member of this guild!`);
    }

    //variables to use for embedded message
    let eganAvatar = bot.users.find(user => user.id === "310638075875295235").displayAvatarURL;
    let p = egan.presence;
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
      let bother = (egan.voiceChannel) ? "Yep" : "Nope";
      fields.push({"name": "Bothering someone", "value": bother});
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
};

module.exports.info = {
  name: "egan",
  usage: ".egan",
  description: "Will tell you if egan is online and what he is doing"
};