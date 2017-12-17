const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    var output = "";
    var channels = Array.from(Array.from(client.guilds)[0][1].channels);
    for(var i=0;i<channels.length;i++){
        var curchan = channels[i][1];
        output+=((curchan.type=="text"?":page_facing_up:":":speaker:")+` **${curchan.name}**` + ((curchan.topic==null||curchan.topic=="")?"":"\n      Topic: "+curchan.topic) + "\n");
    }
    var output2 = new Discord.RichEmbed().addField('\u200B', output, false);
    Shell.log(output2,1);
};
