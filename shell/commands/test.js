const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo, conn) => {
    if(args[0]=='voice'){
        conn.playFile('./shell/assets/test.mp3');
        Shell.log('Playing audio file. If you don\'t hear this message, something probably isn\'t working.',1);
    } else if(sudo){
        Shell.log(`Everything's in working order, master ${message.author.username}.`,1);
    } else {
        Shell.log(`Everything's dandy over here, ${message.author.username}!`,1);
    }
}