const Shell = require('../../klari0m2.js');
exports.run = (client, message, args, sudo) => {
    var output = "";
    var channels = Array.from(Array.from(client.guilds)[0][1].channels);
    for(var i=0;i<channels.length;i++){
        var curchan = channels[i][1];
        output+=(`Name: ${curchan.name}\nType: ${curchan.type}` + (curchan.topic==""?"":"\nTopic: "+curchan.topic) + "\n");
    }
    Shell.log(output,1);
});
