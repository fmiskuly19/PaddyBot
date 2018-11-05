module.exports.run = (bot, message,args) => {

    let currentGuild = message.guild;
    let member = message.mentions.members.first();
    let channelName = args[1];

    //make sure we got the proper input
    if (!member) {
        return message.reply(`Please mention a valid server member`);
    }
    else if (!channelName || channelName.charAt(1) === '#') {
        return message.reply(`Please mention a valid voice channel!`);
    }

    //get guild channels
    let guildChannels = currentGuild.channels;
    let selectedChannel = guildChannels.find(channel => channel.name == channelName);

    if (!selectedChannel) {
        return message.reply(`${selectedChannel} is not a valid voice channel!`);
    }
    else if (selectedChannel.type != "voice") {
        return message.reply(`That channel is not a voice channel!`)
    }

    if (!member.voiceChannel) {
        return message.reply(`User must already be connected to a voice channel!`)
    }

    member.setVoiceChannel(selectedChannel.id)
        .then(() => message.channel.send(`Moved ${member} to voice channel ${channelName}`));
        
};

module.exports.info = {
    name: "move",
    usage: ".move @user 'channelname'",
    description: "Moves user to specified channel name"
};