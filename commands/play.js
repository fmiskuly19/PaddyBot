//const SpotifyWebApi = require('spotify-web-api-node');
const ytdl = require('ytdl-core');
const fs = require('fs');
const Youtube = require('simple-youtube-api');
const yt = new Youtube(process.env.YOUTUBE_KEY);

// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     redirecturl: "https://paddybot.herokuapp.com"
// });

//get access token.. need to refresh access token.. dont know how yet
// spotifyApi.clientCredentialsGrant().then(
//     function(data) {
//       console.log('The access token expires in ' + data.body['expires_in']);
//       console.log('The access token is ' + data.body['access_token']);

//       spotifyApi.setAccessToken(data.body['access_token']);
//     },
//     function(err) {
//       console.log('Something went wrong when retrieving an access token', err);
//     }
// );

module.exports.run = (bot,message,args) => {
    
    let guild = message.guild;
    let member = guild.members.find(member => member.id === message.author.id);
    if(!member)
        return message.reply(`something went wrong!`);
    
    let channel = member.voiceChannel;
    if(!channel)
        return message.reply(`User must be connected to a voice channel!`);
    
    let searchTerm = args.join(" ");
    if(!searchTerm)
        return message.reply(`Please provide a song to play!`);

    yt.searchVideos(searchTerm, 4)
        .then(results => {
            let url = "https://www.youtube.com/watch?v="
            url = url.concat(results[0].raw.id.videoId);
            let broadcast = bot.createVoiceBroadcast();
            let song = ytdl(url);
            let songtitle = results[0].title;
        
            channel.join()
              .then(connection => {
                broadcast.playStream(song);
                const dispatcher = connection.playBroadcast(broadcast);
                message.channel.send(`Playing ${songtitle} in ${channel.name}`);
              })
              .catch(console.error);
        })
        .catch(console.log);

    // let searchTerm = args.join(" ");
    // // Search tracks whose name, album or artist contains 'Love'
    // spotifyApi.searchTracks(searchTerm)
    //     .then(function(data) {
    //         console.log(`Search by ${searchTerm}`, data);
    //     }, function(err) {
    //         console.error("Error: ",err);
    //     }
    // );
}

module.exports.info = {
    name: "play",
    usage: ".play 'song name'",
    description: "plays song from youtube"
}; 