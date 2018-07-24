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
	  var tsMin = myDate.getMinutes()

	  if (tsMin < 10) { var tsMin = '0' + tsMin };

	  if (tsHours > 12 ) {
		  tsStamp = (tsHours - 12) + ':' + tsMin + ' ' + 'PM';
	  } else {
		  tsStamp = tsHours + ':' + tsMin + ' ' + 'AM' ;
	  };
	  strStamp = dateStr + ' ' + tsStamp;
	  return strStamp;
};

  // New Channel Selection
  function switchChannel(e) {
    document.querySelectorAll('.channel-items').forEach((ci) => {
      if (ci.classList.contains('active-channel') ) {
          ci.classList.remove('active-channel');
        };
    })
    var chtarget = (e.target);
    e.target.setAttribute('style', "font-weight: bold;")
    chtarget.classList.add("active-channel");

  };

  // Scroll Control
  function gotoBottom(id){
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;

  };

document.addEventListener('DOMContentLoaded', function() {

  // Check Local Storage
  var localUser = localStorage.getItem('display_name');
  if(localUser) {
    document.getElementById('choosename').style.display = 'none';
    document.querySelectorAll('.message-input').forEach(function(mi) {
      mi.disabled = false;
      });
    socket_info['display_name'] = localUser;
    var welcomeBack = 'Hi ' + localUser;
    document.getElementById('welcome_user').innerHTML = welcomeBack;

  };

  //Display Name Entry
  document.getElementById('choosename').onsubmit = function() {
    display_name = document.getElementById('usernameInput').value;
    socket_info['display_name'] = display_name;
    localStorage.setItem('display_name',display_name);
    console.log(localStorage.getItem('display_name'));

    var userWelcome = document.getElementById('welcome_user').innerHTML
    userWelcome = 'Welcome ' + display_name;
    document.getElementById('welcome_user').innerHTML = userWelcome;

    //Hide User Input Form and Set Message Center to Enabled
    if (display_name.length > 1) {
      document.getElementById('choosename').style.display = 'none';
      document.querySelectorAll('.message-input').forEach(function(mi) {
        mi.disabled = false;
      });
    };

    return false;
  };


  // Add Channels
  document.querySelector('#addchannel').onsubmit = function() {
    const chName = document.forms["addchannel"]["channel"].value.trim();
    //console.log(chName);
    socket.emit('add_new_channel', {'name': chName});
    document.forms["addchannel"]["channel"].value = '';
    return false
  };

  // Alert if Channel Already Exists
  socket.on('channel_alert', function(msg) {
    //console.log(msg);

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
  socket.on('display_channel', function(channel) {
    var newChannel = document.createElement('li');
    newChannel.innerHTML = channel.trim();
    newChannel.setAttribute("class","channel-items list-group-item");
    newChannel.setAttribute("id","list-" + channel + "-list");
    newChannel.onclick = switchChannel;
    document.querySelector(".list-group").appendChild(newChannel);
    //console.log("Received" + newChannel)
  });

  // Channel Selection
  document.querySelectorAll('.channel-items').forEach(function(item) {
    item.onclick = function() {
      document.querySelectorAll('.channel-items').forEach(function(other) {
        if (other.classList.contains('active-channel') ) {
          other.classList.remove('active-channel');
        };
      });

      document.querySelectorAll('[id^="grid"]').forEach(function(sect) {
        if (sect.classList.contains('hide-item') == false) {
          sect.classList.add('hide-item');
        };
      });

      var myChannel = this.id;
      var roomName = this.innerHTML.trim();
      var myChat = myChannel.replace('list','grid');

      document.getElementById(myChat).classList.remove('hide-item');
      this.classList.add("active-channel");
      socket_info['channel_name'] = roomName;
      //console.log('Room:' + socket_info['channel_name']);

    };
  });


  // Message Send
  document.querySelectorAll('.sendbutton').forEach(function(btn) {
    btn.onclick = function() {
      var msgElem = '#' + socket_info['channel_name'] + '-' + 'myMessage';

      var msgcontent = document.querySelector(msgElem).value;
      var timestamp = timestamp_format()

      socket.emit('user_messages',
          {'user': socket_info['display_name'], 'msgcontent': msgcontent, 'timestamp': timestamp, 'room': socket_info['channel_name'] });

      document.querySelector(msgElem).value = '';
      return false;
    };
  });

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

    var listmsg = msg['room'] + '-' + 'messages';

    document.getElementById(listmsg).appendChild(newMessage);
    gotoBottom(listmsg);

    /* Test Logging
    console.log("Received " + msg['msg_user'] + ' ' + msg['msg_message'] + ' ' + msg['room']);
    console.log("Appending " + newMessage);
    console.log("To " + listmsg);
    */


  });

});