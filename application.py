import os, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of channels and messages per channel.  Default is General
channel_list = ['general']
channel_messages = {'general': [{'msg_user': 'Ethan', 'msg_message': 'Hello', 'msg_time': '7/22/2018 8:37 PM'}]}
"""
#Testing

channel_list = ['general','one','two']
channel_messages = {
    'general': [{'msg_user': 'Ethan', 'msg_message': 'Hello', 'msg_time': '7/22/2018 8:37 PM'}] ,
    'one': [{'msg_user': 'Bob', 'msg_message': 'There', 'msg_time': '7/22/2018 8:37 PM'}] ,
    'two': [{'msg_user': 'Tom', 'msg_message': 'You', 'msg_time': '7/22/2018 8:37 PM'}] ,
}
"""

# Render Index Template
@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html", channels=channel_list, ch_messages=channel_messages)


#Adding Channels
@socketio.on('add_new_channel')
def add_new_channel(chjson):
    new_channel= chjson['name']
    if new_channel in channel_list:
        emit('channel_alert',{'data': f"Channel '{new_channel}' Already Exists!" })
    else:
        channel_list.append(new_channel)
        channel_messages[new_channel] = {}
        emit('display_channel',new_channel, broadcast=True)


#Message Room Control
@socketio.on('user_messages')
def handle_usr_message(message):
    channel_messages[message['room']].append({'msg_user': message['user'], 'msg_message': message['msgcontent'], 'msg_time': message['timestamp'] })
    print(channel_messages)
    emit('msg_response', {'msg_user': message['user'], 'msg_message': message['msgcontent'], 'msg_time': message['timestamp'], 'room': message['room'] },
    broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)