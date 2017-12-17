const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    Shell.log(args,1);
    if(args===undefined) return Shell.log("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    else {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
        Shell.log(`The command ${args[0]} has been reloaded`,1);
    }
};