const 
    Shell = require('../../klari0m2.js'),
    ytdl = require('ytdl-core');
exports.run = (client, message, args, sudo, conn) => {
    if(!args[0]){
        Shell.respond([
            `${message.author.username}, this command takes arguments, and you didn't give any.`,
            `Uhh... ${message.author.username}, what do I... do?`
        ]);
        return;
    }
    if(args[0]=='play'){
        //Play command recieved
        if(!args[1]){
            Shell.respond([
                `${message.author.username}, there's no URL or directory to play!`,
                `Hey ${message.author.username}, What do you want me to play? Try tryping the whole command again.`
            ]);
            return;
        }
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