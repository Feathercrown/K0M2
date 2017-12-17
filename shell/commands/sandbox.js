const shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    if(args[0]=='play'){
        client.channels
        .get(config.terminal.voice)
        .join()
        .then(connection =>{
            connection.playFile('./shell/assets/startup.mp3');
        })
        .catch(err => Shell.log(err, 3));
    }
}