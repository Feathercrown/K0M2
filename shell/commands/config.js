const Shell = require('../../klari0m2.js');
var config = require('../../config.json');
exports.run = (client, message, args, sudo) => {
    
    if(message.guild!==null){
        Shell.respond([
            `${message.author.username}, SHHH! Not in a public guild!`,
            `${message.author.username}, DM me if you want to look at that.`,
            `NO, ${message.author.username}! You're not doxxing me! Move this to a DM! D:<`
        ]);
        return;
    }
    else if(!sudo){
        Shell.respond([
            `${message.author.username}, you don't have permission to view the config file from Discord!`,
            `I'm sorry, ${message.author.username}, but I'm afraid I'm not allowed to show you that.`
        ]);
        return;
    }
    else if(!args[0]){
        Shell.respond([
            `${message.author.username}, this module takes arguments, and you didn't give any.`,
            `Uhh... ${message.author.username}, what do you... want to do with my config file?`
        ]);
        Shell.log(`\`\`\`[Usage: config <js Object properties/methods>]\`\`\``,1);
        return;
    }
    switch(args[0]){
        case 'entries':
            Shell.log(`\`\`\`${Object.entries(config)}\`\`\``,1);
    }
}