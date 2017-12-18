const Shell = require('../../klari0m2.js');
const config = require('../../config.json');
const ytdl = require('ytdl-core');
exports.run = (client, message, args, sudo, conn) => {
    let url = ytdl(args[1]);
    if(args[0]=='play'){
        //Play command recieved
        conn.playFile('./shell/assets/playing_audio.mp3')
            .once("start", start => {
                Shell.log('Playing audio file...',1);
            })
            .once("end", end => {
                conn.playStream(url)
                .once("end", end => {
                    Shell.log('Audio stream over.',1);
                });
            });   
    }
}