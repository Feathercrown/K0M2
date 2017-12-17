//100% Feathercrown-made
const Shell = require('../../klari0m2.js');
const Discord = require('Discord.js');
exports.run = (client, message, args, sudo) => {
    var output = "";
    var embed = new Discord.RichEmbed();
    var channels = Array.from(Array.from(client.guilds)[0][1].channels);
    if(channels.length>25){
        Shell.log("Error: More than 25 channels!",1);
    } else {
        for(var i=0;i<channels.length;i++){
            var curchan = channels[i][1];
            try{
            embed.addField('\u200B',((curchan.type=="text"?":page_facing_up:":":speaker:")+` **${curchan.name}**` + ((curchan.topic==null||curchan.topic=="")?"":"\n      Topic: "+curchan.topic) + "\n"),false);
            }catch(e){
                Shell.log("Error: "+curchan.name+" has too long of a description (or name)!",1);
            }
        }
    }
    Shell.log({embed},1);
};
