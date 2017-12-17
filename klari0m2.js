"use strict";
var messageGlobal = undefined,
    ready = false;
const shell = require('./klari0m2.js'),
    date = new Date(),
    latestLog =`./logs/${date.toDateString().replace(/[\s:]/g,'-')+'-'+date.toLocaleTimeString().replace(/[\s:]/g,'-')}.txt`,
    fs = require('fs');
/**
 * Easy Logging
 * 
 * Internal Utility Function for Klari Gen.0_M.2.
 * Records logs only visible to the terminal.
 * @param {*} str Anything that you want to log. 
 * @param {number} err Log's error value.
 * 
 * 0 = INFO
 * 1 = KLARI (Logs to Discord)
 * 2 = WARN
 * 3 = ERROR
 * 4 = FATAL
 * 5 = OK
 * 
 * Defaults to INFO if no error code is given.
 */
exports.log = (str, err) => {
    let color;
    let terminalDate = new Date().toTimeString().substr(0,8);
    switch (err){
        case 5:
            color = '\x1b[32m';
            err = 'OK]';
            break;
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
            if(config.terminal.quietMode){
                client.channels.get(config.terminal.channel).send(str);
                if(messageGlobal!==undefined){
                    messageGlobal.channel.send(str);
                }
            }
            break;
        case 0:
        default:
            color = '\x1b[37m';
            err = 'INFO]';
            break;
    }   
    let logFile = fs.createWriteStream(latestLog,'',(err)=>{
        if(err) {
            return console.log(err);
        }
    });
    if(ready && !config.terminal.quietMode){
        client.channels.get(config.terminal.channel).send(`\`${'['+terminalDate+' '+err+' '+str}\``);
    }
    return console.log(color+'['+terminalDate+' '+err+' '+str);
};

/**
 * Require with Sprinkles
 * 
 * Internal Utility Function for Klari Gen.0_M.2.
 * Invokes `require()` on input parameter, and logs input to the terminal.
 * @param {string} str Anything that you want to `require()`. 
 */
function mount(str) {
    try {
        shell.log('Mounting '+str);
        return require(str);
    } catch (err) {
        shell.log(err, 3);
    }
}
//File requirements and what not
shell.log('Starting boot timer');
const bootStart = Date.now();
var config = mount('./config.json');
const Discord = mount('discord.js');
const Fse = mount('fs-extra');
const Ffmpeg = mount('ffmpeg');
shell.log('Done!',5);


// Boot Sequence
shell.log('Creating new Discord client');
const client = new Discord.Client();
shell.log('Done!',5);

shell.log('Logging into Discord server');
client.login(config.token);
shell.log('Done!',5);

shell.log('Readying Discord module');
client.on('ready', ()=>{
    //Wrap listeners and handlers in this 'ready' method
    ready = true;
    shell.log('Preparing listeners between Node and Discord...',1);

    //Global message listener (listening to all servers in Discord)
    client.on('message', message =>{
        // Remote terminal
        messageGlobal = message;
        if(message.author.id == config.selfId) return;
        shell.log(`DISCORD MESSAGE>
    [   GUILD: ${message.guild.name}
    [ CHANNEL: #${message.channel.name}
    [    USER: ${message.author.username} #${message.author.discriminator}
    [ CONTENT: "${message.content}"
    `);
        if(!message.content.startsWith(config.terminal.prefix) || !config.terminal.remoteEnabled) return;

        var args = message.content.slice(config.terminal.prefix.length).trim().split(/ +/g);
        var command = args.shift().toLowerCase();

        //Superuser permissions check
        var sudo = false;
        if(command==="sudo"){
            shell.log('SUPERUSER INVOKED', 2);
            if(config.permissions.whitelist.includes(message.author.id)){
                sudo = true;
                shell.log(`Match found in whitelist for user "${message.author.username}". Attached command running at elevated permission.`, 5);
                command = args.shift();
            } else {
                shell.log(`No match found in whitelist for user "${message.author.username}". Permission denied; parsing terminated.`, 3);
                return message.reply('You lack the permissions required to use Superuser mode. Access denied and command parsing terminated.');
            }
        }
        
        try {
            require(`./shell/commands/${command}.js`)
                .run(client, message, args, sudo);
        } catch (err) {
            shell.log(err, 3);
            shell.log(`Hmm. This '${command}' module you speak of doesn't seem to exist. Have you, by any chance, mistyped?`, 1);
        }
    });

    const bootEnd = Date.now();
    shell.log(`Done! Finished boot process in ${(bootEnd-bootStart)/1000} seconds. Hello, world!`,1);
    if(!config.terminal.quietMode){
        shell.log('Quiet Mode has been Disabled.',1);
    }
    shell.log('Boot process complete. Ctrl-C to terminate Node environment.',5);
    // End of Boot Sequence.
    
});