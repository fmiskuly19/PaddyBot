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
        .then(() => {
            //TODO get top played games

            var games = steamUser2GamesList.filter(g => steamUser1GamesList.find(g2 => g.name === g2.name));
            var gameChoice = games[Math.floor(Math.random() * games.length)];  
            console.log(games);
            const embed = {
                "color": 3530521,
                "fields": [
                    {
                        "name": `Games in common`,
                        "value": `${games.length} games`
                    },
                    {
                        "name": `${steamUser1}'s most played game`,
                        "value": "Rocket League with 400 hours played"
                    },
                    {
                        "name": `${steamUser2}'s most played game`,
                        "value": "Rocket League with 400 hours played"
                    },
                    {
                        "name": `Game choice`,
                        "value": `${steamUser1} and ${steamUser2} should play ${gameChoice.name} together!`
                    },
                ]
            };
            return message.channel.send({ embed });

            // const embededMessage = {
            //     "color": 3530521,
            //     "fields": [
            //         {
            //             "name": `Games in common`,
            //             "value": `${games.length} games`
            //         },
            //         {
            //             "name": `${steamUser1}'s most played game`,
            //             "value": "Rocket League with 400 hours played"
            //         },
            //         {
            //             "name": `${steamUser2}'s most played game`,
            //             "value": "Rocket League with 400 hours played"
            //         },
            //         {
            //             "name": `Game choice`,
            //             "value": `${steamUser1} and ${steamUser2} should play ${gameChoice.name} together!`
            //         },
            //     ]
            // };
            // message.channel.send(embededMessage).then(message => {
            //     message.channel.send({embed: {
            //         "author": {
            //             "name": `${steamUser1PlayerSummary.nickname}`,
            //             "url": `https://steamcommunity.com/id/${steamUser1}`,
            //             "icon_url": `${steamUser1PlayerSummary.avatar.small}`
            //         },
            //         "thumbnail": {
            //             "url": `${steamUser1PlayerSummary.avatar.large}`
            //         },
            //         "color": 3530521,
            //         "fields": [
            //             {
            //                 "name": `Games`,
            //                 "value": `${steamUser1GamesList.length}`
            //             },
            //             {
            //                 "name": `Most played game`,
            //                 "value": "Rocket League",
            //                 "inline": true
            //             },
            //             {
            //                 "name": `Hours`,
            //                 "value": "400",
            //                 "inline": true
            //             },
            //         ]
            //     }});
            // });
        });
};

module.exports.info = {
    name: "steamgames",
    usage: ".steamgames 'SteamID' 'SteamID2'",
    description: "Gets common games from two users steam library and optionally picks one to play. Steam user must have a public facing profile."
};