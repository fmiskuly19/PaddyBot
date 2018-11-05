module.exports.run = async (bot, message,args) => {
    
    let member = message.mentions.members.first();

    if (!member) {
        return message.reply("Please mention a valid member of this server");
    }

    //variables to use for embedded message
    let memberAvatar = bot.users.find(user => user.id === member.id).displayAvatarURL;
    let p = member.presence;
    let color =
        (p.status === "online") ? 8978176 :
            (p.status === "offline") ? 16711680 :
                16098851;

    //by default, only field is online status
    var fields = [{ "name": "Status", "value": p.status }]; 

    //check if online
    if (p.status != "offline") {
        let inGame = (p.game) ? p.game.name : "No";
        //add in game field
        fields.push({ "name": "In Game", "value": inGame })
        /*
            note: these awkward nested ifs are to error check for many possibilities here 
            when bots are online they have a game but no timestamps
            when users are online in an app but not a game (ie: spotify) they have timestamps but no start
            when users are online in game they have a game, timestamp, and start 

            these nested ifs make sure all fields exist before accessing the lowest layer to display playtime
            there is probably a better way to do this
        */
        if(p.game){
            if(p.game.timestamps){
                if(p.game.timestamps.start){
                    //get time difference in hours and restrict it to two decimals
                    let timePlayed = (Math.abs(p.game.timestamps.start - new Date()) / 36e5).toFixed(2);
                    let time = timePlayed.split('.');
                    let hours = time[0];
                    let minutes = ((time[1]*60)/100).toFixed(0); 
                    let output = `${hours} hours and ${minutes} minutes`
                    if(hours == 0)
                        output = `${minutes} minutes`;
                    //add playtime field
                    fields.push({ "name": "Time", "value": output });
                }
            }
        }   
    }

    const embed = {
        "author": {
            "name": member.displayName,
            "icon_url": memberAvatar
        },
        "color": color,
        "thumbnail": {
            "url": memberAvatar,
        },
        "fields": fields
    };

    await message.channel.send({ embed });
};

module.exports.info = {
    name: "status",
    usage: ".status @user",
    description: "Gives current status of specified user"
};