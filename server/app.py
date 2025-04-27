import eventlet # type: ignore
eventlet.monkey_patch() 
#for the purposes of threading
import string
import threading
#Import Flask object
from flask import Flask, render_template, request, g # type: ignore
#import socket.io
from flask_socketio import SocketIO, join_room, leave_room, close_room, emit # type: ignore
import random, string

#import database functions
from utils.memoryDB import *
from utils.persistentDB import *
import signal
import sys
import time

#flask constructor. Takes name as argument
app = Flask(__name__, template_folder='../client/dist', static_folder='../client/dist/assets')
app.config['SECRET_KEY'] = 'secret!'

#Initialize SocketIO
socketio = SocketIO(app, async_mode='eventlet')
#socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins=["http://localhost:5173","http://localhost:5174"])

#variables for game control
game_thread = None
game_running = False
game_lock = threading.Lock()

#Connect to db
connection, cursor = db_init_game_db()

#Game items
# indoorItems = ['shoe','mug'] (old indoor items (using teachable Model))
indoorItems = ['mug', 'phone', 'water bottle', 'plant', 'book bag', 'tv', 'laptop', 'frisbee', 
               'baseball bat', 'banana', 'apple', 'orange', 'carrot', 'sandwich', 'tie', 'wine glass',
              'knife', 'bowl', 'scissors', 'toothbrush' , 'football', 'book']

outDoorItems = ['person', 'bicycle', 'car', 'motorcycle', 'bus', 'train', 'truck',
    'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench',
    'bird', 'cat', 'dog', 'book bag', 'umbrella', 'frisbee', 'football', 'baseball bat',
    'baseball glove', 'skateboard', 'tennis racket', 'pizza', 'donut', 'cake', 'plant', ]

#ensures connection is closed and database is freed
def close_db(signal, frame):
  if connection:
    print("closing database connection")
    connection.close()
  sys.exit(0)

@app.route('/', methods=['GET'])
def home():
  return render_template('index.html')

@socketio.on('connect')
def hande_connection():
  print(f"A Client connected: {request.sid}")
  #add user
  db_add_user(cursor, request.sid, "Anonymous", 0)

#Username change (exits in both join room and create room)
@socketio.on('username change')
def handle_username_change(data):
  #change username
  username = data['data']
  db_set_username(cursor, request.sid, username)

@socketio.on('register')
def handle_register(data):
  username = data['username']
  password = data['password']
  if(not find_user(username)):
    #if user doesn't exist, register them
    print(f"Registering new user: {username}")
    create_user(username, password)
    db_set_username(cursor, request.sid, username)  # Set the username for the new user
    emit('register response', {'success': True, 'message': 'Registration successful!'})
  else:
    print(f"User {username} already exists. Registration failed.")
    emit('register response', {'success': False, 'message': 'Username already exists. Please choose another one.'})

@socketio.on('login')
def handle_login(data):
  username = data['username']
  password = data['password']
  user= find_user(username)
  if(user) : user = user[0] #get user data 
  print(f"Attempting to log in user: {username} with password: {password} should match {user[1] if user else 'None'}")
  if (user and user[2] == password):
    print(f"User {username} logged in successfully.")
    db_set_username(cursor, request.sid, username)  # Set the username for the logged-in user
    emit('login response', {'success': True, 'message': 'Login successful!'})
  else:
    print(f"Login failed for user {username}. Incorrect username or password.")
    emit('login response', {'success': False, 'message': 'Incorrect username or password.'})
#returns an array of all playing users
@socketio.on('all users')
def handle_get_all_users():
  allUsers = db_get_users(cursor)
  emit('all users response', allUsers, room=request.sid)

@socketio.on('join attempt')
def handle_join_attempt(data):
  print('join attempt')
  roomCode = data.get('roomcode')
  print(roomCode, " this is the room code")
  #check if roomCode exists
  if db_room_exists(cursor, roomCode) is None:
    print("room not found")
    emit('join response', {'success': False}, room=request.sid)
    return
  #set user in host priority
  db_set_user_join(cursor, request.sid, roomCode)
  #add user to room
  db_set_user_room(cursor, request.sid, roomCode)
  #set user score to 0
  db_set_user_score(cursor, request.sid, 0)
  #add user to room
  join_room(roomCode)
  #let user proceed to game_page
  emit('join response', {'success': True}, room=request.sid)
  #get username
  username = db_get_username(cursor, request.sid)
  #print user joined game
  print(f"Client {request.sid}: {username} joined room:{roomCode}")

#Create room Page
@socketio.on('create game')
def handle_create_game(data):
  #generate random 6 uppercase alphanumeric character room code
  roomCode = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
  while db_room_exists(cursor, roomCode):
    #Generate random 6 uppercase alphanumeric character room code
    roomCode = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
  # create room and set initial game state
  db_add_room(cursor, roomCode, "waiting", "[no items]", 0, data.get('mode'))
  #check if room exists
  if(db_room_exists(cursor, roomCode) == False):
    print("room creation failed")
    return
  #make user first in host priority
  db_set_user_join(cursor, request.sid, roomCode)
  # set user room code to be roomCode
  db_set_user_room(cursor, request.sid, roomCode)
  #set user score to 0
  db_set_user_score(cursor, request.sid, 0)
  #Create room with Room code
  join_room(roomCode)
  #emit game created to allow user to join room
  res = {'sid':request.sid, 'roomCode':roomCode}
  emit('game created', res, room=request.sid)
  #get username
  username = db_get_username(cursor, request.sid)
  #output that user created room
  print(f"Client {request.sid}: {username} created room:{roomCode}")

@socketio.on('connect game')
def handle_connect_game():
  #check if room exists for user
  roomCode = db_get_user_room(cursor,request.sid)
  if roomCode == None or roomCode == "None":
    #TODO:Error handling if room doesn't exist
    #emit a reroute signal to home page
    return
  #check if room exists in rooms
  roomCode = db_room_exists(cursor, roomCode)
  if roomCode == None:
    #TODO: Error handling if room doesn't exist in rooms
    #emit a reroute signal to home page
    return
  #retrieve game state
  start_time = time.time()
  gameState = db_get_game_state(cursor, roomCode)
  end_time = time.time()
  print(end_time - start_time)
  #check if game state exists
  if gameState == None:
    #TODO: error handling if game state doesn't exist
    return
  
  #retrieve game mode
  game_mode = db_get_game_mode(cursor, roomCode)

  #emit game state to room code
  emit('room data', gameState, room=roomCode)
  #get username
  username = db_get_username(cursor, request.sid)
  #output to console that user connected to game
  print(f"Client {request.sid}: {username} connected to room:{roomCode}")

@socketio.on('leave game')
def handle_leave_game():
  #get username
  username = db_get_username(cursor, request.sid)
  #output to console that user left roomm
  print(f"{request.sid}:{username} left a room")
  #get roomCode data
  roomCode = db_get_user_room(cursor, request.sid)
  if roomCode == "None" or roomCode == None:
    #TODO: error handling if user doesn't have a room code but attempts to leave room
    return
  #check if roomCode is in rooms
  roomCode = db_room_exists(cursor, roomCode)
  if roomCode is None:
    #TODO: error handling if user tried to leave room that isn't in rooms
    return
  #Remove user by setting user room to None
  db_set_user_room(cursor, request.sid, "None")
  #check if there are still users in room
  if db_room_empty(cursor, roomCode):
    print(f"Room:{roomCode} is empty, closing the room")
    #delete room from rooms table
    db_delete_room(cursor, roomCode)
    #close the room
    close_room(roomCode)
  else:
    #get game state
    gameState = db_get_game_state(cursor, roomCode)
    #emit updated room data to remaining players
    emit('room data', gameState,room=roomCode)
  #Make user leave room
  leave_room(roomCode)
  pass

#TODO: user disconnect function
@socketio.on("disconnect")
def handle_disconnect():
  #get username
  username = db_get_username(cursor, request.sid)
  print(f"{request.sid}:{username} has disconnected")
  #get roomcode from user
  roomCode = db_get_user_room(cursor, request.sid)
  #delete user from database:
  db_delete_user(cursor, request.sid)
  #Check if user was in room
  if roomCode:
    #Check if room needs to be deleted
    if db_room_empty(cursor, roomCode):
      print(f"Room:{roomCode} is empty, closing the room")
      #delete room from rooms table
      db_delete_room(cursor, roomCode)
      #close the room
      close_room(roomCode)
    else:
      #get game state
      gameState = db_get_game_state(cursor, roomCode)
      #emit updated room data to remaining players
      emit('room data', gameState,room=roomCode)
  leave_room(roomCode)

#TODO: game loop function on a separate thread
def game_loop():
  global game_running
  while game_running:
    with game_lock:

      pass
    eventlet.sleep(1)
    
@socketio.on('start game')
def handle_start_game(data=None):
  global game_running, game_thread
  with game_lock:

    #get room code of user
    roomCode = db_get_user_room(cursor,request.sid)
    if roomCode == None or roomCode == "None":
      #TODO: Error handling if user is not in room
      return
    # #Get game state
    gameState = db_get_game_state(cursor, roomCode)
    if gameState == None:
      #TODO: Error handling if there is no game that exists
      return
    #Get username
    username = db_get_username(cursor, request.sid)
    #Print that user requested to run game
    
    if not db_is_room_host(cursor, request.sid, roomCode):
      return
    
    #gets game mode
    game_mode = data.get('mode')
    if isinstance(game_mode, list):
      game_mode = game_mode[0]  # Extract the first element if it's a list

    print(f"{request.sid}:{username} has requested to start the game in room:{roomCode} playing {game_mode}")

    #Set game mode
    #db_set_game_mode(cursor, roomCode, game_mode)

    #TODO: reimplement
    ########################
    # print(f"{request.sid}:{username} has requested to start the game in room:{roomCode} playing {mode_value}")
    ########################
    #Check if user a host that can start the game
    
    #Set start time
    db_set_room_time(cursor, roomCode, time.time())
    #Update game state to running
    db_set_room_game_state(cursor, roomCode, "running")
    #Generate items for players to guess
    
    game_items = []
    print(game_mode)
    # selects game items based on mode
    if game_mode == "ItemBlitz":
      game_items.extend(random.sample(indoorItems, len(indoorItems)))
    else: #ItemRace
      game_items.extend(random.sample(indoorItems, 5))



    #TODO: reimplement
    # ################################################
    # #item storage will be different based on mode
    # if mode_value == "ItemRace":
    #   #creates list of 5 unique items from items
    #   game_items.extend(random.sample(items, 5)) 
    # else:
    #   #randomly orders every item (for countDown mode)
    #   random.shuffle(items)
    #   game_items.extend(items)  
    # #turn the items into a json encoded string
    # ##################################################

    game_items = json.dumps(game_items)
    #set the items in the room
    db_set_room_items(cursor, roomCode, game_items)
    #reset user scores in room to be 0
    db_set_room_user_scores(cursor, roomCode, 0)
    #Get game state
    gameState = db_get_game_state(cursor, roomCode)
    #emit start game in case pop up is there
    emit('start game', room=roomCode)
    #start game loop if it isn't started
    if not game_running:
      game_running = True
      game_thread = eventlet.spawn(game_loop)
    emit('room data', gameState, room=roomCode)

@socketio.on('end game')
def handle_end_game():
  global game_running
  with game_lock:
    #get room code of user
    roomCode = db_get_user_room(cursor,request.sid)
    if roomCode == None or roomCode == "None":
      #TODO: Error handling if user is not in room
      return
    # #Get game state
    gameState = db_get_game_state(cursor, roomCode)
    if gameState == None:
      #TODO: Error handling if there is no game that exists
      return
    
    if not db_is_room_host(cursor, request.sid, roomCode):
      return
    #Get username
    username = db_get_username(cursor, request.sid)
    #Print that user requested to run game
    print(f"{request.sid}:{username} has requested to end the game in room:{roomCode}")
    #Update game state to running
    db_set_room_game_state(cursor, roomCode, "waiting")
    #Update the game state
    gameState = db_get_game_state(cursor, roomCode)
    #emit start game in case pop up is there
    emit('start game', room=roomCode)
    #end game loop
    game_running = False
    #emit updated room data
    emit('room data', gameState, room=roomCode)

#TODO: FINISH submit function
@socketio.on('submit')
def handle_submit(data):
  roomCode = db_get_user_room(cursor,request.sid)
  if roomCode == None or roomCode == "None":
    #TODO: Error handling if user is not in room
    return
  # #Get game state
  gameState = db_get_game_state(cursor, roomCode)
  if gameState == None or gameState == "waiting":
    #TODO: Error handling if there is no game that exists
    return
  #get current user score
  score = db_get_user_score(cursor, request.sid)[0]
  #get current items and parse it into an array
  items = json.loads(db_get_room_items(cursor, roomCode)[0])
  #get submitted val
  submitItem = data['submit']
  print(submitItem)
  if submitItem == items[score%len(items)]:
    #update the score
    score += 1
    db_set_user_score(cursor, request.sid, score)
    print(score)
    game_mode = data.get('mode')
    #check if victory
    if score == 5 and game_mode == "ItemRace":
      db_set_room_game_state(cursor,roomCode, "waiting")
      #TODO: emit win time
      username = db_get_username(cursor, request.sid)
      #get end time
      startTime = db_get_room_time(cursor, roomCode)[0]
      endTime = time.time()
      finalTime = round(endTime - startTime, 4)
      save_scores(roomCode, finalTime, game_mode)
      emit('winner', {'message': f"{username}", 'time': f"{finalTime}"}, room=roomCode)
  #get new game state
  gameState = db_get_game_state(cursor, roomCode)
  emit('room data', gameState, room=roomCode)


@socketio.on('get leaderboard')
def handle_get_leaderboard_data(data):
    top_scores = get_top_scores()
    
    print("data from get_top_scores: ", top_scores)
    formatted_scores = [{'Id': score[0], 'Pfp': '', 'Name': get_username(score[1]), 'Score': score[2], 'GameMode': score[4], 'Time':score[3]} for score in top_scores]
    print("formatted data: ", formatted_scores)
    emit('leaderboard data', formatted_scores, room=request.sid)

def save_scores(roomCode, finalTime, gameMode):
  print("saving scores")
  #gameMode = db_get_game_mode(roomCode)
  place = 1
  users = db_get_users_in_room_by_score(cursor, roomCode)
  if gameMode == "ItemRace":
    # score == time
    for user in users:
      save_score(user[2], f"{finalTime} seconds", "ItemRace", place)
      place += 1
  elif gameMode == "ItemBlitz":
  # score == time;
      for user in users:
        save_score(user[2], f"{user[3]} points", "ItemBlitz", place)
        place += 1
  elif gameMode == "GeoQuest":
  # TODO i think this is first to complete may need to change 
    for user in users:
        save_score(user[2], f"{finalTime} seconds", "ItemBlitz", place)
        place += 1
  else:
    print(f"Unknown game mode: {gameMode}")
    return
  print('scores saved')
  
@socketio.on('get gamemode')
def get_gamemode():
  game_mode = db_get_game_mode(cursor, db_get_user_room(cursor, request.sid))
  emit ('game mode', game_mode, room=request.sid)

@socketio.on('set gamemode')
def set_gamemode(data):
  db_set_game_mode(cursor, db_get_user_room(cursor, request.sid), data)

if __name__ == '__main__':
  # Register the signal handler to close the database connection on termination
  initialize_db()
  _, DB_PATH, _ = get_DB_path()
  print("db location: ", DB_PATH)
  signal.signal(signal.SIGINT, close_db)
  signal.signal(signal.SIGTERM, close_db)

  #socketio.run(app,debug=True)

  #1) Create a normal eventlet listening socket
  listener = eventlet.listen(('0.0.0.0', 8050))


  #2) Wrap it in SSL
  ssl_listener = eventlet.wrap_ssl(
      listener,
      certfile='mycert.pem',    # Path to your certificate
      keyfile='mykey.pem',      # Path to your private key
      server_side=True
  )

  #3) Serve your Flask-SocketIO app using eventlet’s wsgi.server
  # We pass socketio.WSGIApp(...) so that Socket.IO routes also work.
  eventlet.wsgi.server(
    ssl_listener,
    app
  )