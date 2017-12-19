const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    if(args[0]===undefined){
        Shell.respond([
            `${message.author.username}! YOU FOOL! YOU FORGOT TO PUT AN ARGUMENT IN! AHH!`,
            `Uhh... ${message.author.username}... you forgot to actually... y'know... tell me what to reload.`,
            `I can't reload myself yet, so stick to reloading modules for now.`
        ]);
        return;
    } else {
        let selector = args[0].toLowerCase();
        // the path is relative to the *current folder*, so just ./filename.js
        delete require.cache[require.resolve(`./${selector}.js`)];
        Shell.log(`The "${selector}" module has been reloaded.`,1);
    }
};