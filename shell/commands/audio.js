const 
    Shell = require('../../klari0m2.js'),
    ytdl = require('ytdl-core');
exports.run = (client, message, args, sudo, conn) => {}
    
    if(args[0]==='play'){
        //Play command recieved
        try {
            let url = ytdl(args[1]);
            conn.playFile('./shell/assets/playing_audio_url.mp3')
                .once("start", start => {
                    Shell.log('Playing audio from YouTube URL...',1);
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
        } catch (err) {
            Shell.log(err,1);
        }
        
    } 
}