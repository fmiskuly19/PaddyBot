module.exports.run = async (bot,message,args) => {

    let member = message.mentions.members.first();
      
    if(!member) 
      return message.reply(`Please mention a valid server member`);
    else if(member.mute){
      return message.reply(`Server member is already muted`);
    }
    
    member.setMute(true);
    await message.channel.send(`${member} was muted`);
    
};

module.exports.info = {
  name: "mute",
  usage: ".mute @user",
  description: "Mutes specified user"
};