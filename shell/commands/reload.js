const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    if(args===undefined) return Shell.log("Must provide a command name to reload.",1);
    // the path is relative to the *current folder*, so just ./filename.js
    else {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
        Shell.log(`The "${args[0]}" module has been reloaded.`,1);
    }
};