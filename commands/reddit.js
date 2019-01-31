const snoowrap = require('snoowrap');

const reddit = new snoowrap({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
    clientSecret: process.env.REDDIT_SECRET,
    clientId: process.env.REDDIT_CLIENT_ID,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PW
});

module.exports.run = async (bot, message,args) => {

    let sub = args[0];

    if(!sub){
        return message.reply('Please specify a subreddit!')
    }
    
    const m = await message.channel.send("Loading...");
    reddit.getSubreddit(sub).getTop({time: 'day'}).then(function(response){
        if (typeof response === 'string' || response instanceof String){
            //reddit API will return a string if there is an issue getting to the API (wrong credentials)
            m.edit('There was an error getting to reddit!');
        }
        else{
            let top = response[0];
            const embed = {
                "title": top.title,
                "color": 15925503,
                "image": {
                  "url": top.url
                },
                "author": {
                  "name": `u/${top.author.name}`,
                  "url": `https://cdn.discordapp.com/embed/avatars/0.png`,
                  "icon_url": "https://i.imgur.com/BoZkPHv.png"
                }
              };
              m.edit(`Here is the top post of the day from reddit.com/r/${sub}`,{embed});
        }
    });
};

module.exports.info = {
    name: "reddit",
    usage: ".reddit",
    description: "Gets top post of the day from user specified sub"
};