module.exports.run = (bot, message,args) => {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
};

module.exports.info = {
    name: "say",
    usage: ".say 'message'",
    description: "Repeats message"
};