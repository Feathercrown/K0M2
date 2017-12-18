"use strict";
console.log('\nInitializing...\n')
var
    conn,
    config = require('./config.json'),
    messageGlobal = undefined,
    ready = false, 
    bootDone = false;
const
    bootStart = Date.now(),
    Discord = require('discord.js'),
    Shell = require('./klari0m2.js'),
    date = new Date(),
    Ffmpeg = require('ffmpeg'),
    latestLog =`./logs/${date.toDateString().replace(/[\s:]/g,'-')+'-'+date.toLocaleTimeString().replace(/[\s:]/g,'-')}.txt`,
    fs = require('fs'),
    Opus = require('node-opus');

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
                if(!bootDone){
                    client.channels.get(config.terminal.channel).send(str);
                }
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
    if(ready && !config.terminal.quietMode){
        client.channels.get(config.terminal.channel).send(`\`${'['+terminalDate+' '+err+' '+str}\``);
    }
    return console.log(color+'['+terminalDate+' '+err+' '+str);
};

// Boot Sequence
Shell.log('Creating new Discord client');
const client = new Discord.Client();

Shell.log('Logging into Discord server');
client.login(config.token);

Shell.log('Readying Discord module');
client.on('ready', ()=>{
    //Wrap listeners and handlers in this 'ready' method
    ready = true;
    Shell.log('Preparing listeners between Node and Discord...',1);

    //Global message listener (listening to all servers in Discord)
    client.on('message', message =>{
        //Hoist message to a global var
        messageGlobal = message;

        //If message was sent by bot itself, return
        if(message.author.id == config.selfID) return;
        Shell.log(`DISCORD MESSAGE>
    [   GUILD: ${message.guild.name}
    [ CHANNEL: #${message.channel.name}
    [    USER: ${message.author.username} #${message.author.discriminator}
    [ CONTENT: "${message.content}"`);

        //If remote terminal isn't enabled, return
        if(!config.terminal.remoteEnabled) return;

        let prefix = false;
        for(const thisPrefix of config.terminal.prefixes) {
          if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }
        if(!prefix) return;

        //Prepare message for evaluation
        var inArgs = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g),
            command = inArgs.shift().toLowerCase(),
            args = inArgs.map( v => v.toLowerCase());
            sudo = false;

        //Superuser permissions check
        if(command=="sudo"){
            Shell.log('SUPERUSER INVOKED', 2);
            if(config.permissions.whitelist.includes(message.author.id)){
                sudo = true;
                Shell.log(`Match found in whitelist for user "${message.author.username}". Attached command running at elevated permission.`, 5);
                command = args.shift();
            } else {
                Shell.log(`No match found in whitelist for user "${message.author.username}". Permission denied; parsing terminated.`, 3);
                return message.reply('You lack the permissions required to use Superuser mode. Access denied and command parsing terminated.');
            }
        }
        //Empty command check
        if(command==''){
            let responses = [
                `Hmm?`,
                `I've been summoned?`,
                `Do you require assistance, ${message.author.username}?`,
                `Anything I can help you with, ${message.author.username}?`,
                `Aww... Lonely, ${message.author.username}?`
            ];
            return Shell.log(responses[Math.round(Math.random() * responses.length)],1);
        }
        
        try {
            require(`./shell/commands/${command}.js`)
                .run(client, message, args, sudo, conn);
        } catch (err) {
            Shell.log(`${err}`, 1);
        }
    });

    //Play startup message
        client.channels
            .get(config.terminal.voice)
            .join()
            .then(connection =>{
                connection.playFile('./shell/assets/startup.mp3');
                conn=connection;
            })
            .catch(err => Shell.log(err, 3));

    const bootEnd = Date.now();
    Shell.log(`Done! Finished boot process in ${(bootEnd-bootStart)/1000} seconds. Hello, world!`,1);
    if(!config.terminal.quietMode){
        Shell.log('Quiet Mode has been Disabled.',1);
    }
    Shell.log('Boot process complete. Ctrl-C to terminate Node environment.',5);
    bootDone = true;
    // End of Boot Sequence.
    
});