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
        if (p.game) {
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