module.exports.run = (bot, message,args) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    const embed = {
        "color": 6143,
        "timestamp": `${dateTime}`,
        "footer": {
            "icon_url": `${bot.user.displayAvatarURL}`,
            "text": "Paddy bot"
        },
        "fields": [
            {
                "name": "Information",
                "value": "PaddyBot is written in javascript using discord.js: a very powerful node.js module"
            },
            {
                "name": "Resources",
                "value": "https://anidiots.guide/ \nhttps://discord.js.org/#/docs/main/stable/general/welcome \nhttps://leovoel.github.io/embed-visualizer/"
            },
            {
                "name": "Github",
                "value": "[Github repo](https://github.com/fmiskuly19/PaddyBot)"
            },
            {
                "name": "Host",
                "value": "[Heroku](https://paddybot.herokuapp.com/)"
            }
        ]
    };

    message.channel.send({ embed });
};

module.exports.info = {
    name: "info",
    usage: ".info",
    description: "Information about Paddy Bot"
};