import os, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['one','two','three','five','six']
user_messages = {}

# Render Index Template
@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html", channels=channel_list)

#User Login and Display Name
@app.route("/login", methods=['POST'])
def login():
    """Login Form"""
    session['username'] = request.form['username']
    return render_template("index.html")

@app.route('/test')
def test():
    #session.clear()
    return f"{session['username']}"


@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    send(msg, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)