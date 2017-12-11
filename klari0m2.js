'use strict';
const shell = require('./klari0m2.js');

/**
 * Easy Logging
 * 
 * Internal Utility Function for Klari Gen.0_M.2. Records logs only visible to the terminal.
 * @param {*} str Anything that you want to log. 
 * @param {number} err Log's error value.
 * 
 * 0 = INFO
 * 
 * 1 = KLARI (Logs to Discord)
 * 
 * 2 = WARN
 * 
 * 3 = ERROR
 * 
 * 4 = FATAL
 * 
 * Defaults to INFO if no error code is given.
 */
exports.log = function(str, err){
    let color;
    switch (err){
        case 4:
            color = '\x1b[41m\x1b[30m';
            err = 'FATAL]\x1b[0m\x1b[31m';
            break;
        case 3:
            color = '\x1b[31m';
            err = 'ERROR]';
            break;
        case 2:
            color = '\x1b[33m';
            err = 'WARN]';
            break;
        case 1:
            color = '\x1b[35m';
            err = 'KLARI>';
            client.channels.get(config.terminal.channel).send(`\`${'['+new Date().toTimeString().substr(0,8)+' '+err+' '+str}\``);
            break;
        case 0:
        default:
            color = '\x1b[37m';
            err = 'INFO]';
            break;
    }
    return console.log(color+'['+new Date().toTimeString().substr(0,8)+' '+err+' '+str);
};

//File requirements and what not
shell.log('Starting boot timer...');
const bootStart = Date.now();

function mount(str){
    shell.log('Mounting ' + str);
    return require(str);
}

var config = mount('./config.json');

const Discord = mount('discord.js');
const Fse = mount('fs-extra');

// Boot Sequence
shell.log('Creating new Discord client and exporting as a global...')
const client = new Discord.Client();
exports.client = client;

shell.log('Logging into Discord server...');
client.login(config.token);

shell.log('Readying Discord module...')
client.on('ready', ()=>{
    //Wrap listeners and handlers in this 'ready' method

    shell.log('Preparing listeners between Node and Discord...',1);

    //Global message listener (listening to all servers in Discord)
    client.on('message', message =>{
        // Remote terminal
        if(message.author.id == config.id) return;
        shell.log(`DISCORD MESSAGE>
    [   GUILD: ${message.guild.name}
    [ CHANNEL: #${message.channel.name}
    [    USER: ${message.author.username} #${message.author.discriminator}
    [ CONTENT: "${message.content}"
    `);
        if(!message.content.startsWith(config.terminal.prefix) || !config.terminal.remoteEnabled) return;

        const args = message.content.slice(config.terminal.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        try {
            let extCommand = require(`./shell/commands/${command}.js`);
            extCommand.run(client, message, args);
        } catch (err) {
            shell.log(err, 3);
        }
    });

    const bootEnd = Date.now();
    shell.log(`Done! Finished boot process in ${(bootEnd-bootStart)/1000} seconds.`,1);
    shell.log('\x1b[32mBoot process complete. Ctrl-C to terminate Node environment.\x1b[0m');
    // End of Boot Sequence.
});