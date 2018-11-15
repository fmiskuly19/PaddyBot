const eganID = '310638075875295235';
const frankID = '177280495317549056';

/*
    memberBefore is member before voiceStateUpdate event occured
    memberAfter is member after voiceStateUpdate event occured
*/

module.exports = (bot, memberBefore, memberAfter) => {

    if(process.env.MOVE_EGAN === "0")
        return console.log(`move egan flag set to 0`);

    //return if it wasnt egan that the event was thrown for
    if(memberAfter.user.id != eganID)
        return console.log(`wasnt egan`);

    //return if user is disconnecting from channel, rather than joining
    if(memberAfter.voiceChannelID === null)
        return console.log(`user leaving channel`);

    let frank = memberAfter.voiceChannel.members.find(m => m.user.id === frankID);
    if(!frank)
        return console.log(`frank not connected to egans channel`);

    //move egan to afk channel, if the guild doesnt have one just move him to the last channel
    if(memberAfter.guild.afkChannelID === null)
        return console.log(`guild has no afk channel`);

    memberAfter.setVoiceChannel(memberAfter.guild.afkChannelID);
        
}