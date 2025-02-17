#Import Flask object
from flask import Flask, render_template, request
#import socket.io
from flask_socketio import SocketIO, join_room, leave_room, emit
import random
#for the purposes of threading
import threading
import time

#flask constructor. Takes name as argument
app = Flask(__name__, template_folder='../client/dist', static_folder='../client/dist/assets')
app.config['SECRET_KEY'] = 'secret!'

# Initialize SocketIO
socketio = SocketIO(app)

#dictionary to track current online users
users = {}

#dictionary to track online users in rooms if we implement multiple rooms in the future
rooms = {}

#Items for game 
items = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
currItem = ""

#variables for game control
game_thread = None
is_game_running = False
game_lock = threading.Lock()


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

@socketio.on('start_timer')
def handle_start_timer(): #for rooms emit with room ID
  print('Timer started')
  emit('timer_started', broadcast=True)

@socketio.on('connect game')
def handle_connect_game():
  print(f"Client {request.sid}: {users[request.sid]} joined game room")

  join_room("Game room")

  if("Game room" not in rooms):
    rooms["Game room"] = []

  rooms["Game room"].append([request.sid, users[request.sid],0])

  emit('room data', rooms["Game room"],room = "Game room")

  start_game()

  emit('item data', currItem, room = "Game room")

@socketio.on('leave game')
def handle_disconnect_game():
  print(f"Client {request.sid}: {users[request.sid]} left game room")

  leave_room("Game room")

  #remove user from room if they go to a different page
  if("Game room" in rooms):
    rooms["Game room"] = [user for user in rooms["Game room"] if user[0] != request.sid]

    #stop game if no players left
    if(not rooms["Game room"]):
      end_game()

  emit('room data', rooms["Game room"],room = "Game room")

@socketio.on("disconnect")
def handle_disconnect():
  if(request.sid in users):
    
    #remove user from room if they go to a different page
    if("Game room" in rooms):
      rooms["Game room"] = [user for user in rooms["Game room"] if user[0] != request.sid]
      #stop game if no players left

      if not rooms["Game room"]:
        end_game()
    
    #remove users from users
    print(f"Client {request.sid}: {users[request.sid]} disconnected")
    del users[request.sid]

    emit('room data', rooms["Game room"],room = "Game room")

@socketio.on("check input")
def handle_check_input(data):
  if(not request.sid in users):
    return
  if(not "Game room" in rooms or not currItem):
    return
  
  #if data is equal to current item, increment score, otherwise give them a false response
  if(data == currItem):
    emit('server input res',{"response": "Correct"},room = "Game room")
    for user in rooms["Game room"]:
      if user[0] == request.sid:
        user[2] += 1
        break
  else:
    emit('server input res',{"Reponse": "Inccorrect"},room = "Game room")
  emit('room data', rooms["Game room"],room = "Game room")

#Game Logic
def send_item():
  global is_game_running
  global currItem
  while is_game_running:
    with game_lock:
      if("Game room" in rooms):
        currItem = random.choice(items)
        socketio.emit('item data', currItem)
    time.sleep(8)

def start_game():
  global is_game_running
  with game_lock:
      if(not is_game_running):
        print("Starting the game")
        is_game_running = True
        game_thread = threading.Thread(target=send_item, daemon=True)
        game_thread.start()

def end_game():
  global is_game_running
  with game_lock:
    if(is_game_running):
      print("Stopping the game")
      is_game_running = False

if __name__ == '__main__':
  socketio.run(app, debug=True)
