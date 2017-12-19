const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    console.log(args,1);
    if(args===[]){
        Shell.log("Must provide a command name to reload.",1);
        return
    } else {
        // the path is relative to the *current folder*, so just ./filename.js
        delete require.cache[require.resolve(`./${args[0].toLowerCase()}.js`)];
        Shell.log(`The "${args[0].toLowerCase()}" module has been reloaded.`,1);
    }
};