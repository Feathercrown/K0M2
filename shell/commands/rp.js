const shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    shell.log(args.shift())

}