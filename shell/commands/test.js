const shell = require('../internal/log.js')

exports.run = (client, message, args) => {
    message.channel.send("pong!").catch(console.error);
    shell.log('Test',1);
}