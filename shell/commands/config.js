const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    
    if(!sudo){
        Shell.respond([
            `${message.author.username}, you don't have permission to view the config file from Discord!`,
            `NO, ${message.author.username}! That's an invasion of privacy! Hmph."`
        ]);
        return;
    }
    if(!args[0]){
        Shell.respond([
            `${message.author.username}, this command takes arguments, and you didn't give any.`,
            `Uhh... ${message.author.username}, what do you... want to do with my config file?`
        ]);
        return;
    }
    if(message.guild!==null){
        Shell.respond([
            `${message.author.username}, SHHH! Not in a public chat room.`,
            `${message.author.username}, DM me if you want to look at that.`
        ]);
        return;
    }
    
}