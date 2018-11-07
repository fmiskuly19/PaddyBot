module.exports.run = async (bot,message,args) => {
    let currentGuild = message.guild;
    let connections = bot.voiceConnections;
    let currentConnection = connections.find(c => c.channel.guild.id == currentGuild.id);

    if(!currentConnection)
        return message.reply('I am not connected to a voice channel!');

    await currentConnection.disconnect();
    await message.reply(`disconnected from ${currentConnection.channel.name}`);
}

module.exports.info = {
    name: "dc",
    usage: ".dc",
    description: "disconnects  bot from current voice channel"
}; 