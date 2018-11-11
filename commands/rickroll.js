const ytdl = require('ytdl-core');
const fs = require('fs');
const Youtube = require('simple-youtube-api');
const yt = new Youtube(process.env.YOUTUBE_KEY);
const ffmpeg = require('ffmpeg-binaries');

module.exports.run = async (bot, message, args) => {

    let member = message.mentions.members.first();

    if (!member)
        return message.reply(`Please mention a valid member of this server`);

    let channel = member.voiceChannel;
    if (!channel)
        return message.reply(`User must be connected to a voice channel!`);

    let song = ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    channel.join()
        .then(async connection => {
            let broadcast = bot.createVoiceBroadcast();
            await message.channel.send(`Get rick rolled!`);
            await message.channel.send(`*(type .dc to disconnect me!)*`);
            broadcast.playStream(song);
            const dispatcher = connection.playBroadcast(broadcast);
        })
        .catch(console.error);
};

module.exports.info = {
    name: "rickroll",
    usage: ".rickroll @user",
    description: "Rick rolls specified user"
};