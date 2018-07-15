import os

from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
#socketio = SocketIO(app)

# list of all channels
channel_list = ['general']

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        new_channel= request.form.get('channel')
        if new_channel in channel_list:
            return "ALREADY IN THERE"
        else:
            channel_list.append(new_channel)

    return render_template("index.html", title="Index", channels=channel_list)
