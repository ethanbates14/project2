  // Web Socket Set Up
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  var socket_info = {
    'session_id': '',
    'display_name': '',
    'channel_name': ''
  }

  // Connect to websocket
  socket.on('connect', function() {
    console.log('Websocket connected!');
    socket_info['session_id'] = socket.id ;
    socket_info['channel_name'] = 'general' ;
  });

  // Timestamp Format
  function timestamp_format() {
    var myDate = new Date();
	  var dateStr = myDate.getMonth()+1 + '/' + myDate.getDate() + '/' + myDate.getFullYear();
	  var tsHours = myDate.getHours();
	  if (tsHours > 12 ) {
		  tsStamp = (tsHours - 12) + ':' + myDate.getMinutes() + ' ' + 'PM';
	  } else {
		  tsStamp = tsHours + ':' + myDate.getMinutes() + ' ' + 'AM' ;
	  };
	  strStamp = dateStr + ' ' + tsStamp;
	  return strStamp;
}

document.addEventListener('DOMContentLoaded', function() {

  //Display Name
  document.getElementById('choosename').onsubmit = function() {
    display_name = document.getElementById('usernameInput').value;
    socket_info['display_name'] = display_name;
    console.log(socket_info);

    var userWelcome = document.getElementById('welcome_user').innerHTML
    userWelcome = 'Welcome ' + display_name;
    document.getElementById('welcome_user').innerHTML = userWelcome;

    //Hide User Input Form and Set Message Center to Enabled
    document.getElementById('choosename').style.display = 'none';
    document.getElementById('general-myMessage').disabled = false;

    return false;
  };


  // Add Channels
  document.querySelector('#addchannel').onsubmit = function() {
    const chName = document.forms["addchannel"]["channel"].value;
    console.log(chName);
    socket.emit('add_new_channel', {'name': chName});
    document.forms["addchannel"]["channel"].value = '';
    return false
  };

  // Alert if Channel Already Exists
  socket.on('channel_alert', function(msg) {
    console.log(msg);

    var chAlert = document.createElement('div');
    chAlert.innerHTML = msg['data'];
    chAlert.setAttribute("role","alert");
    chAlert.setAttribute("class","alert alert-danger alert-dismissible");

    var closeBtn = document.createElement('button');
    closeBtn.setAttribute("type","button");
    closeBtn.setAttribute("class","close");
    closeBtn.setAttribute("data-dismiss","alert");
    closeBtn.setAttribute("aria-label","Close");

    var closeX = document.createElement('span');
    closeX.setAttribute("aria-hidden","true");
    closeX.innerHTML = 'X';

    document.querySelector('#addchannel').appendChild(chAlert);
    chAlert.appendChild(closeBtn);
    closeBtn.appendChild(closeX);

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

  // Channel Selection



  // Message Send
  document.querySelector('#general-sendbutton').onclick = function() {
    var msgcontent = document.querySelector('#general-myMessage').value;
    var timestamp = timestamp_format()
    console.log(msgcontent);
    socket.emit('user_messages',
        {'user': socket_info['display_name'], 'msgcontent': msgcontent, 'timestamp': timestamp, 'room': 'general' });

    document.querySelector('#general-myMessage').value = '';
    return false;
  };

  // Message Listen
  socket.on('msg_response', (msg) => {
    var newMessage = document.createElement('li');
    var userWrap = document.createElement('span');
    var userTimeStmp = document.createElement('span');
    var userMsg = document.createElement('p');

    //UserName
    userWrap.innerHTML = msg['msg_user'];
    userWrap.setAttribute("class","msg_username");

    //Timestamp
    userTimeStmp.innerHTML = '[' + msg['msg_time'] + ']';
    userTimeStmp.setAttribute("class","msg_timestamp");

    //Message Contents
    userMsg.innerHTML = msg['msg_message'];
    userMsg.setAttribute("class","msg_user_content");

    newMessage.appendChild(userWrap);
    newMessage.appendChild(userTimeStmp);
    newMessage.appendChild(userMsg);

    document.getElementById("general-messages").appendChild(newMessage);
    console.log("Received " + socket_info['display_name'] + msg);
  });

});
