import os, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['general']
user_messages = []

# Render Index Template
@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html", channels=channel_list)


#Adding Channels
@socketio.on('add_new_channel')
def add_new_channel(chjson):
    new_channel= chjson['name']
    if new_channel in channel_list:
        emit('channel_alert',{'data': f"Channel '{new_channel}' Already Exists!" })
    else:
        channel_list.append(new_channel)
        emit('display_channel',new_channel, broadcast=True)


#Message Room Control
@socketio.on('user_messages')
def handle_usr_message(message):
    print(message)
    emit('msg_response', {'msg_user': message['user'], 'msg_message': message['msgcontent'], 'msg_time': message['timestamp'] }, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)