#Import Flask object
from flask import Flask, render_template, request
#import socket.io
from flask_socketio import SocketIO, join_room, leave_room, emit

#flask constructor. Takes name as argument
app = Flask(__name__, template_folder='../client/dist', static_folder='../client/dist/assets')
app.config['SECRET_KEY'] = 'secret!'

# Initialize SocketIO
socketio = SocketIO(app)

#dictionary to track current online users
users = {}

#dictionary to track online users in rooms if we implement multiple rooms in the future
rooms = {}

#Example list of items



@app.route('/', methods=['GET'])
def home():
  return render_template('index.html')

@socketio.on('connect')
def hande_connection():
  print(f"A Client connected: {request.sid}")
  users[request.sid] = "Anonymous"


@socketio.on('client connection')
def handle_my_event(json):
  print('Received client connection: ' + str(json))
  emit('server acknowledge', {'data': 'Server acknowledged your connection'})

@socketio.on('username change')
def handle_username_change(data):
  users[request.sid] = data['data']

@socketio.on('connect game')
def handle_connect_game():
  print(f"Client {request.sid}: {users[request.sid]} joined game room")

  join_room("Game room")

  if("Game room" not in rooms):
    rooms["Game room"] = []

  rooms["Game room"].append([request.sid, users[request.sid]])

  emit('room data', rooms["Game room"],room = "Game room")

@socketio.on('leave game')
def handle_disconnect_game():
  print(f"Client {request.sid}: {users[request.sid]} left game room")

  leave_room("Game room")

  #remove user from room if they go to a different page
  if("Game room" in rooms):
    rooms["Game room"] = [user for user in rooms["Game room"] if user[0] != request.sid]

  emit('room data', rooms["Game room"],room = "Game room")
    



@socketio.on("disconnect")
def handle_disconnect():
  if request.sid in users:
    
    #remove user from room if they go to a different page
    if("Game room" in rooms):
      rooms["Game room"] = [user for user in rooms["Game room"] if user[0] != request.sid]
    
    #remove users from users
    print(f"Client {request.sid}: {users[request.sid]} disconnected")
    del users[request.sid]



    

if __name__ == '__main__':
  socketio.run(app, debug=True)
