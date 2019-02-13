const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_SECRET);

module.exports.run = async (bot, message, args) => {
    if (args.length !== 2) {
        return message.reply('Please provide the required parameters. For help with PaddyBot commands, type .help!');
    }

    var steamUser1 = args[0];
    var steamUser2 = args[1];
    var steamUserID1;
    var steamUserID2;
    var steamUser1PlayerSummary;
    var steamUser2PlayerSummary;
    var steamUser1GamesList = [];
    var steamUser2GamesList = [];
    var chosenGameId;

    var getUser1 = function() {
        return steam.resolve(`https://steamcommunity.com/id/${steamUser1}`).then(id => {
            steamUserID1 = id;
            console.log("steamUser1 from 1st promise:", steamUserID1);
        })
        .catch(err => {
            console.log(err);
            return message.reply(`Something went wrong! Please make sure that ${steamUser1} is a valid steam username.`)
        });
    }

    var getUser2 = function(){
        return steam.resolve(`https://steamcommunity.com/id/${steamUser2}`).then(id => {
            steamUserID2 = id;
            console.log("steamUser2 from 2st promise:", steamUserID2);
        }).catch(err => {
            console.log(err);
            return message.reply(`Something went wrong! Please make sure that ${steamUser2} is a valid steam username.`)
        });
    }

    var getUser1Profile = function(){
        return steam.getUserSummary(steamUserID1).then(summary => {
            // TODO make sure visibility flag is set to 3
            // if(summary.visibilityState !== 3){
            //     return('');
            // }
            steamUser1PlayerSummary = summary;
            console.log(summary);
        });
    }

    var getUser2Profile = function(){
        return steam.getUserSummary(steamUserID2).then(summary => {
            steamUser2PlayerSummary = summary;
            console.log(summary);
        });
    }
    
    var getUser1OwnedGames = function(){
        return steam.getUserOwnedGames(steamUserID1).then(games => {
            console.log("number of games: ", games.length);
            steamUser1GamesList = games;
        }).catch(err => {
            console.log("Something went wrong!");
        });
    }

    var getUser2OwnedGames = function(){
        return steam.getUserOwnedGames(steamUserID2).then(games => {
            console.log("number of games: ", games.length);
            steamUser2GamesList = games;
        }).catch(err => {
            console.log(err);
        });
    }

    var displayUserInfo = function(){
        //TODO get top played games

        var gamesInCommon = steamUser2GamesList.filter(g => steamUser1GamesList.find(g2 => g.name === g2.name));
        var gameChoice = gamesInCommon[Math.floor(Math.random() * gamesInCommon.length)]; 
        chosenGameId = gameChoice.appID;

        var steamUser1MostPlaytime = Math.max.apply(Math, steamUser1GamesList.map(function(g) { return g.playTime; }));
        var steamUser1MostPlayedGame = steamUser1GamesList.find(function(g){ return g.playTime == steamUser1MostPlaytime; })

        var steamUser2MostPlaytime = Math.max.apply(Math, steamUser2GamesList.map(function(g) { return g.playTime; }));
        var steamUser2MostPlayedGame = steamUser2GamesList.find(function(g){ return g.playTime == steamUser2MostPlaytime; })
        

        var embed = {
            "author": {
                "name": steamUser1,
                "url": `https://steamcommunity.com/id/${steamUser1}`,
                "icon_url": steamUser1PlayerSummary.avatar.small                
            },
            "thumbnail": {
                "url": steamUser1PlayerSummary.avatar.medium
            },
            "color": 62975,
            "fields": [
                {
                    "name": 'Games',
                    "value": `${steamUser1GamesList.length} games`,
                },
                {
                    "name": 'Games in common',
                    "value": gamesInCommon.length,
                },
                {
                    "name": 'Most played game',
                    "value": steamUser1MostPlayedGame.name,
                },
                {
                    "name": 'Time played',
                    "value": `${Math.floor(steamUser1MostPlayedGame.playTime/60)} hours`,
                },
            ]
        };
        
        m.edit({ embed });

        embed = {
            "author": {
                "name": steamUser2,
                "url": `https://steamcommunity.com/id/${steamUser2}`,
                "icon_url": steamUser2PlayerSummary.avatar.small                
            },
            "thumbnail": {
                "url": steamUser2PlayerSummary.avatar.medium
            },
            "color": 3530521,
            "fields": [
                {
                    "name": 'Games',
                    "value": `${steamUser2GamesList.length} games`,
                },
                {
                    "name": 'Games in common',
                    "value": gamesInCommon.length,
                },
                {
                    "name": 'Most played game',
                    "value": steamUser2MostPlayedGame.name,
                },
                {
                    "name": `Time played`,
                    "value": `${Math.floor(steamUser2MostPlayedGame.playTime/60)} hours`,
                },
            ]
        };

        message.channel.send({ embed });
    }

    var getSteamGameById = function(){
        return steam.getGameDetails(chosenGameId).then(game => {
            message.channel.send({embed: {
                "title": `You should play: ${game.name}!`,
                "url": `https://store.steampowered.com/app/${game.steam_appid}`,
                "description": game.short_description,
                "color": 16374367,
                "image": {
                    "url": game.header_image
                  },
                "fields": [
                    {
                        "name": `User1 playtime`,
                        "value": "value",
                        "inline": true,
                    },
                    {
                        "name": `User2 playtime`,
                        "value": "value",
                        "inline": true,
                    },
                ],
            }});
        });
    }

    const m = await message.channel.send("Loading...");

    getUser1()
        .then(getUser2)
        .then(() => {
            console.log("done geting users");
        })
        .then(getUser1Profile)
        .then(getUser2Profile)
        .then(() => {
            console.log("done getting profiles")
        })
        .then(getUser1OwnedGames)
        .then(getUser2OwnedGames)
        .then(displayUserInfo)
        .then(getSteamGameById);
};

module.exports.info = {
    name: "steamgames",
    usage: ".steamgames 'SteamID' 'SteamID2'",
    description: "Gets common games from two users steam library and optionally picks one to play. Steam user must have a public facing profile."
};