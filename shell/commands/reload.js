const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    if(!sudo){
        Shell.respond([
            `${message.author.username}, you don't have permission to reload a module!`,
            `NO, ${message.author.username}! You aren't on the list, so no reloading! D:<"`
        ]);
        return;
    }
    if(!args[0]){
        Shell.respond([
            `${message.author.username}, this command takes arguments, and you didn't give any.`,
            `Uhh... ${message.author.username}, what do I... do?`
        ]);
        return;
    } else {
        let selector = args[0].toLowerCase();
        // the path is relative to the *current folder*, so just ./filename.js
        delete require.cache[require.resolve(`./${selector}.js`)];
        Shell.log(`The "${selector}" module has been reloaded.`,1);
    }
};