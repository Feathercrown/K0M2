var channels = Array.from(Array.from(client.guilds)[0][1].channels);
var chans=[];
for(var i=0;i<channels.length;i++){
    chans.push({name:channels[i][1].name,id:channels[i][1].id});
  }
console.log(chans);