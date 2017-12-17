const shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    if(!args || args.size < 1) return message.channel.send("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    message.channel.send(`The command ${args[0]} has been reloaded`);
};