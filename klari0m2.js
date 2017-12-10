'use strict';
var shell = require('./shell/internal/log.js')

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
shell.log('Creating new Discord client...')
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
        shell.log(message.content);
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