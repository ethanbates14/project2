document.addEventListener('DOMContentLoaded', () => {

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () => {
    socket.send('User has connected')
  });

  socket.on('message', (msg) => {
    var newMessage = document.createElement('li');
    newMessage.innerHTML = msg;
    document.querySelector("#messages").appendChild(newMessage);
    console.log("Received Message")
  });

  document.querySelector('#sendbutton').onclick = function() {
    var msgcontent = document.querySelector('#myMessage').value;
    console.log(msgcontent);
    socket.send(msgcontent);

  };

  document.querySelectorAll('.channel-items').forEach(function(ch) {
    ch.onclick = function() {
      var chSelect = '#' + ch.innerHTML;
      document.querySelector('#selected_channel').innerHTML = chSelect;

    }

  });



});