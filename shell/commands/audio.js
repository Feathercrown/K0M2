const 
    Shell = require('../../klari0m2.js'),
    ytdl = require('ytdl-core');
var idle = false;
exports.run = (client, message, args, sudo, conn) => {

    let url = ytdl(args[1]);
    if(args[0].toLowerCase()=='play'){
        //Play command recieved
        conn.playFile('./shell/assets/playing_audio.mp3')
            .once("start", start => {
                idle = false;
                Shell.log('Playing audio file...',1);
            })
            .once("end", end => {
                conn.playStream(url)
                    .once("end", end => {
                    conn.playFile('./shell/assets/audio_over.mp3')
                        .once("start", start => {
                            Shell.log('Audio stream over.',1);
                    });
                });
            });   
    }
}