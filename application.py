import os, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['one','two','three','five','six']
user_messages = {}

@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        new_channel= request.form.get('channel')
        if new_channel in channel_list:
            return "ALREADY IN THERE"
        else:
            channel_list.append(new_channel)

    return render_template("index.html", channels=channel_list)

if __name__ == '__main__':
    socketio.run(app)