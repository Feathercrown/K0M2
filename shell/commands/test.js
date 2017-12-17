const shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    if(sudo){
        shell.log(`Everything's in working order, master ${message.author.username}.`,1);
    } else {
        shell.log(`Everything's dandy over here, ${message.author.username}!`,1);
    }
}