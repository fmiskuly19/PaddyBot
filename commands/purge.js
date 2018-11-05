module.exports.run = async (bot, message,args) => {
    if (!message.member.roles.some(r => ["Server Owner"].includes(r.name)))
        return message.reply("Sorry, you don't have permissions to use this!");

    const deleteCount = parseInt(args[0], 10);

    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    const fetched = await message.channel.fetchMessages({ limit: deleteCount });
    message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

    message.reply(` deleted ${deleteCount} messages from ${message.channel}`);
};

module.exports.info = {
    name: "purge",
    usage: ".purge 'number of messages'",
    description: "Deletes specified number of messages"
};