const Discord = require("discord.js");
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_SECRET);

module.exports.run = async (bot, message, args) => {

    console.log("Starting steam command");

    if (args.length < 2) {
        return message.reply('Please provide more than one user. For help with PaddyBot commands, type .help!');
    }

    const m = await message.channel.send({embed: {"title": "Getting Steam IDs...","color": 16772926}});
    console.log("Getting Steam IDs...");

    let promises = [];

    args.forEach(user => {
        promises.push(steam.resolve(`https://steamcommunity.com/id/${user}`));
    });

    //start of promise chain
    Promise.all(promises)
    .then(steamIDs => {
        return steamIDs;
    })
    .then(steamIDs => {

        let summaryPromises = [];
        steamIDs.forEach(id => {
            summaryPromises.push(steam.getUserSummary(id));
        });

        //change loading message
        m.edit({embed: {"title": "Getting Steam profiles...","color": 16772926}});
        console.log("Getting Steam profiles...");

        return Promise.all(summaryPromises);
    })
    .then(profiles => {

        let gamesPromises = [];
        profiles.forEach(profile => {
            gamesPromises.push(steam.getUserOwnedGames(profile.steamID));
        });
        gamesPromises.push(profiles); //push profiles onto promises array to send them to next thenable

        //change loading message
        m.edit({embed: {"title": "Getting Steam games...","color": 16772926}});
        console.log("Getting Steam games...");

        return Promise.all(gamesPromises);
    })
    .then(results => {

        let gamesDetailsPromises = [];
        let profiles = results.pop();
        let gamesLists = results;

        let userInfo = profiles.map((profile, index) => {
            return {p: profile, g: gamesLists[index]}
        })

        gamesDetailsPromises.push(userInfo);
        
        let gamesInCommon = results.shift().filter(function(gameToCompare) {
            return results.every(function(gameList) {
                return gameList.find(game => game.appID === gameToCompare.appID);
            });
        });

        if(gamesInCommon.length < 1){
            throw new Error('Users had no games in common!');
        }

        var gameChoice = gamesInCommon[Math.floor(Math.random() * gamesInCommon.length)]; 

        gamesDetailsPromises.push(steam.getGameDetails(gameChoice.appID));

        m.edit({embed: {"title": "Picking game...","color": 16772926}});
        console.log("Picking game...");
        
        return Promise.all(gamesDetailsPromises);
        
    })
    .then(results => {

        let chosenGame = results.pop();
        let userInfo = results.pop();
        var embed;

        m.edit({embed: {"title": "Finished loading results:","color": 16771840}});
        console.log("Finished loading results.");

        //only show user information if there are two users
        if(userInfo.length < 3){
            userInfo.forEach(user => {
                let mostPlayedGameTime = Math.max.apply(Math, user.g.map(function(game) { return game.playTime; }));
                let mostPlayedGame = user.g.find(g => g.playTime == mostPlayedGameTime);

                embed = new Discord.RichEmbed()
                    .setAuthor(user.p.nickname, user.p.avatar.small, `https://steamcommunity.com/id/${user.p.steamID}`)
                    .setThumbnail(user.p.avatar.medium)
                    .setColor(16772926)
                    .addField('Most played game', mostPlayedGame.name, true)
                    .addField('Time played', `${Math.floor(mostPlayedGame.playTime/60)} hours`, true)
                    .addField('Games', `${user.g.length} games`, true);

                message.channel.send({embed});
            });
        }

        embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username,bot.user.displayAvatarURL, `https://paddybot.herokuapp.com`)
            .setTitle(`You should play: ${chosenGame.name}!`)
            .setURL(`https://store.steampowered.com/app/${chosenGame.steam_appid}`)
            .setDescription(chosenGame.short_description)
            .setColor(16772926)
            .setImage(chosenGame.header_image);

        message.channel.send({embed});

        console.log(`Picked game: ${chosenGame.name}`);
    })
    .catch(err => {
        console.log(err);
        message.reply('Something went wrong! Please try again.');
    });
};

module.exports.info = {
    name: "steamgames",
    usage: ".steamgames 'SteamID1' 'SteamID2' etc.",
    description: "Gets common games from Steam users steam library and picks one to play. Steam users must have a public facing profiles and a custom URL parameter set in their profile settings."
};