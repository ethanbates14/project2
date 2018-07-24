import os, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room
from datetime import datetime


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of channels and messages per channel.  Default is General
startTime = '[' + datetime.now().strftime('%Y/%m/%d') + ']'
channel_list = ['general','social']
channel_messages = {
    'general': [{'msg_user': 'Chatterbox', 'msg_message': 'Hello There!', 'msg_time': startTime}],
    'social': [{'msg_user': 'Chatterbox', 'msg_message': 'Hi!', 'msg_time': startTime}]
}

#Push Out Oldest Message Per Channel - Max 100 msg
def max_messages(array):
    msg_count = len(array)
    if msg_count > 100:
        array.pop(0)

#Check if Room Exists in Dict - if not add
def room_exists(item,target):
    if item not in target.keys():
        target[item] = []

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
        channel_messages[new_channel] = []
        emit('display_channel',new_channel, broadcast=True)


#Message Room Control
@socketio.on('user_messages')
def handle_usr_message(message):

    #Check if Key Exists and Message Count, Add Mesage to Dict of Rooms
    max_messages(message['room'])
    room_exists(message['room'],channel_messages)
    channel_messages[message['room']].append({'msg_user': message['user'], 'msg_message': message['msgcontent'], 'msg_time': message['timestamp'] })

    print(channel_messages)
    emit('msg_response', {'msg_user': message['user'], 'msg_message': message['msgcontent'], 'msg_time': message['timestamp'], 'room': message['room'] },
    broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)