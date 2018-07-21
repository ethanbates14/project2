document.addEventListener('DOMContentLoaded', function() {

  // Web Socket Set Up
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // Connect to websocket
  socket.on('connect', function() {
    console.log('Websocket connected!');
  });

  //User Display Name
  document.querySelector('#senduser').onsubmit = function() {
    const name = document.querySelector('#username').value;
    document.querySelector('#greeting').innerHTML = 'Welcome ' + name;
    document.querySelector('#choosename').style.display = "none";

  };
  // Add Channels
  document.querySelector('#addchannel').onsubmit = function() {
    const chName = document.forms["addchannel"]["channel"].value;
    console.log(chName);
    socket.emit('add_new_channel', {'name': chName});
  };

  socket.on('my_response', function(msg) {
    console.log(msg);
    var chAlert = document.createElement('div');
    chAlert.innerHTML = msg['data'];
    chAlert.setAttribute("role","alert");
    chAlert.setAttribute("class","alert alert-danger");
    document.querySelector('#addchannel').appendChild(chAlert);
  });


  // Channel Selection
  document.querySelectorAll('.channel-items').forEach(function(ch) {
    ch.onclick = function() {
      var chSelect = '#' + ch.innerHTML;
      document.querySelector('#selected_channel').innerHTML = chSelect;
    }
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