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
const main = require('../../klari0m2.js');
const config = require('../../config.json')
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
            main.client.channels.get(config.terminal.channel).send(`\`${'['+new Date().toTimeString().substr(0,8)+' '+err+' '+str}\``);
            break;
        case 0:
        default:
            color = '\x1b[37m';
            err = 'INFO]';
            break;
    }
    return console.log(color+'['+new Date().toTimeString().substr(0,8)+' '+err+' '+str)
};