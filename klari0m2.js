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
/**
 * Flavorful Responding
 * 
 * Internal Utility Function for Klari Gen.0_M.2.
 * Randomizes an input array of template literals to generate flavor text with `Shell.log(responses,1)`.
 * @param {array} responses An array of template literals or text you want to send into the Discord.
 */
exports.respond = (responses) => {
    Shell.log(responses[Math.floor(Math.random() * responses.length)],1);
};

/**
 * Flavor-filled Response.
 * 
 * Internal Utility Function for Klari Gen.0_M.2.
 * Responds to users using an input array of flavor text.
 * @param {array} responses An array of responses the responder can pick from. 
 */
exports.respond = (responses) => {
    Shell.log(responses[Math.floor(Math.random() * responses.length)],1);
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
        if((message.author.id == config.selfID) || message.author.bot) return;

        //Log the message
        Shell.log(`DISCORD MESSAGE>
    [   GUILD: ${message.guild===null?'N/A':message.guild.name}
    [ CHANNEL: ${message.guild===null?'Direct Message':'#'+message.channel.name}
    [    USER: ${message.author.username} #${message.author.discriminator}
    [ CONTENT: "${message.content}"\n`);

        //If remote terminal isn't enabled, return
        if(!config.terminal.remoteEnabled) return;

        //Test for a list of prefix aliases
        let prefix = false;
        for(const thisPrefix of config.terminal.prefixes) {
          if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }
        if(!prefix) return;

        //Prepare message for evaluation
        var args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g),
            command = args.shift().toLowerCase(),
            sudo = false;

        //Owner automatically enters sudo mode
        if(message.author.id===config.permissions.owner){
            sudo = true;
        }
        //Superuser command check
        if(command=="sudo"){
            Shell.log('SUPERUSER INVOKED', 2);
            if(config.permissions.whitelist.includes(message.author.id)){
                sudo = true;
                Shell.log(`Match found in whitelist for user "${message.author.username}". Attached command running at elevated permission.`, 5);
                command = args.shift();
            } else {
                Shell.log(`No match found in whitelist for user "${message.author.username}". Permission denied; parsing terminated.`, 3);
                return message.reply(`You lack the permissions required to use Superuser mode. Access denied and command parsing terminated.`);
            }
        }
        //Empty command check
        if(command==''){
            Shell.respond([
                `Hmm?`,
                `I've been summoned?`,
                `Do you require assistance, ${message.author.username}? If so, check out the manual module, \`man\`.`,
                `Anything I can help you with, ${message.author.username}? If so, check out the manual module, \`man\`.`,
                `Aww... Lonely, ${message.author.username}? Check out the manual module, \`man\`, for some cool utilities and other assorted bits 'n' bobs.`
            ]);
            return;
        }
        
        try {
            require(`./shell/commands/${command}.js`)
                .run(client, message, args, sudo, conn);
        } catch (err) {
            Shell.respond([
                `Hmm... Sorry,${message.author.username}, I can't seem to find this "${command}" module you speak of OR I've thrown an error. Have you, by any chance, mistyped?`,
                `Uhh, ${message.author.username}... This "${command}" module doesn't seem to exist OR I've just thrown an error. Check out the log below.`,
                `Ohnoes, ${message.author.username}! Either I can't find "${command}" or I've just done a goof! I don't know what happened, though, so check out this log that I'm throwing in your face! :D`
            ]);
            Shell.log(`\`\`\`[${err}]\`\`\``, 1);
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