  // Web Socket Set Up
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // Connect to websocket
  socket.on('connect', function() {
    console.log('Websocket connected!');
  });

document.addEventListener('DOMContentLoaded', function() {

  // Add Channels
  document.querySelector('#addchannel').onsubmit = function() {
    const chName = document.forms["addchannel"]["channel"].value;
    console.log(chName);
    socket.emit('add_new_channel', {'name': chName});
    return false
  };

  // Alert if Channel Already Exists
  socket.on('channel_alert', function(msg) {
    console.log(msg);
    var chAlert = document.createElement('div');
    chAlert.innerHTML = msg['data'];
    chAlert.setAttribute("role","alert");
    chAlert.setAttribute("class","alert alert-danger alert-dismissible");
    document.querySelector('#addchannel').appendChild(chAlert);
    return false
  });

  // Channel Display
  socket.on('display_channel', (channel) => {
    var newChannel = document.createElement('li');
    newChannel.innerHTML = channel;
    newChannel.setAttribute("class","channel-items list-group-item");
    document.querySelector(".list-group").appendChild(newChannel);
    console.log("Received" + newChannel)
  });

  // Messages
    document.querySelector('#sendbutton').onclick = function() {
    var msgcontent = document.querySelector('#myMessage').value;
    console.log(msgcontent);
    socket.send(msgcontent);
  };

  socket.on('message', (msg) => {
    var newMessage = document.createElement('li');
    newMessage.innerHTML = msg;
    document.querySelector("#messages").appendChild(newMessage);
    console.log("Received Message")
  });

});
