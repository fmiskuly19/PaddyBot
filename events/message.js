module.exports = async (bot, message) => {
    
    if(message.author.bot) return;
    
    if(message.content.indexOf('.') !== 0) return;
  
    //we dont want bot commands in the main channel
    if(message.channel.position == 0){
      return message.reply(`Please only use bot commands in bot channels. Thank you!`);
    }
    
    const args = message.content.slice(1).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const currentGuild = message.guild;

    let cmd = bot.commands.find(command => command.info.name === commandName);

    if(!cmd) 
      return message.reply(`Please enter a valid command!`);

    cmd.run(bot, message, args);
    
}