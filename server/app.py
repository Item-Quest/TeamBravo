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
import signal
import sys




#flask constructor. Takes name as argument
app = Flask(__name__, template_folder='../client/dist', static_folder='../client/dist/assets')
app.config['SECRET_KEY'] = 'secret!'

#Initialize SocketIO
socketio = SocketIO(app, async_mode='eventlet')

#variables for game control
game_thread = None
game_running = False
game_lock = threading.Lock()

connection, cursor = db_init_game_db()

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


#TODO: Join Room page
@socketio.on('join attempt')
def handle_join_attempt(data):
  roomCode = data.get('roomcode')
  #check if room code exists or not
  # if not redis_server.sismember("rooms", roomCode):
  #   # #if not, tell user to retype
  #   # emit('join response', {'success': False}, room=request.sid)
  #   pass
  # else:
    # #get username
    # username = redis_server.hget(f"{request.sid}", "username")
    # #add user details to redis room in redis
    # redis_server.hset(roomCode, f"user:{request.sid}:username", username)
    # redis_server.hset(roomCode, f"user:{request.sid}:score", 0)
    # #print redis state
    # game_state = redis_server.hgetall(roomCode)
    # print(game_state)
    # #associate socket_id with roomcode
    # redis_server.hset(f"{request.sid}", "room_code", roomCode)

    # #let user join
    # emit('join response', {'success': True}, room=request.sid)
    # join_room(roomCode)
  pass

#Create room Page
@socketio.on('create game')
def handle_create_game():
  #generate random 6 uppercase alphanumeric character room code
  roomCode = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
  while db_room_exists(cursor, roomCode):
    #Generate random 6 uppercase alphanumeric character room code
    roomCode = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
  # create room and set initial game state
  db_add_room(cursor, roomCode, "waiting", "[no items]", 0)
  # set user room code to be roomCode
  db_set_user_room(cursor, request.sid, roomCode)
  db_set_user_score(cursor, request.sid, 0)
  username = db_get_username(cursor, request.sid)
  print(f"Client {request.sid}: {username} created room:{roomCode}")
  #Create room with Room code
  join_room(roomCode)
  # #emit game created to allow user to join room
  emit('game created', room=request.sid)
  
#TODO: Game Page
@socketio.on('connect game')
def handle_connect_game():
  # #get room code
  # roomCode = redis_server.hget(f"{request.sid}", "room_code")
  # if roomCode == None:
  #   #TODO:Error handling if room code doesn't exist
  #   return
  # #check if room exists
  # if not redis_server.sismember("rooms", roomCode):
  #   #TODO: create error handling situation for clientside
  #   print(f"Client:{request.sid} attempted to connect without a room")
  #   return
  # #retrieve game state
  # gameState=redis_server.hgetall(roomCode)
  # if gameState == None:
  #   #TODO: error handling if game state doesn't exist
  #   return
  # #Get Game Code
  # roomCode = gameState['room_code']
  # emit('room data', gameState, room=roomCode)
  pass

#TODO: leave game function
@socketio.on('leave game')
def handle_leave_game():
  # #output to console that user left a room
  # print(f"{request.sid} left a room")
  # #get roomCode data
  # roomCode = redis_server.hget(f"{request.sid}", "room_code")
  # if roomCode:
  #   #Remove user from game state
  #   redis_server.hdel(roomCode, f"user:{request.sid}:username")
  #   redis_server.hdel(roomCode, f"user:{request.sid}:score")
  #   #deassociate socketid with a room
  #   redis_server.hdel(f"{request.sid}", "room_code")
  #   #get game state
  #   gameState=redis_server.hgetall(roomCode)
  #   #check if there are users in the room
  #   users = [key for key in gameState if key.startswith("user:")]
  #   if not users:
  #     print(f"Room {roomCode} is empty, Deleting room data")
  #     #delete game state
  #     redis_server.delete(roomCode)
  #     #delete room from active set of rooms
  #     redis_server.srem("rooms", roomCode)
  #     close_room(roomCode)
  #   else:
  #     #emit updated room data to remaining players
  #     emit('room data', gameState, room=roomCode)
  #   emit('room data', gameState,room=roomCode)
  #   #Make user leave room
  # leave_room(roomCode)
  pass

#TODO: user disconnect function
@socketio.on("disconnect")
def handle_disconnect():
  # print(f"{request.sid} has disconnected")
  # #Retrieve roomCode
  # roomCode = redis_server.hget(f"{request.sid}", "room_code")
  # #delete username associated with request.sid
  # redis_server.hdel(f"{request.sid}", "username")
  # if roomCode:
  #   #Remove user from game state
  #   redis_server.hdel(roomCode, f"user:{request.sid}:username")
  #   redis_server.hdel(roomCode, f"user:{request.sid}:score")
  #   #deassociate socketid with a room
  #   redis_server.hdel(f"{request.sid}", "room_code")
  #   #check if room is empty after removing user
  #   gameState = redis_server.hgetall(roomCode)
  #   users = [key for key in gameState if key.startswith("user:")]
  #   #if no users, delete room
  #   if not users:
  #     print(f"Room {roomCode} is empty, Deleting room data")
  #     #delete game state
  #     redis_server.delete(roomCode)
  #     #delete room from active set of rooms
  #     redis_server.srem("rooms", roomCode)
  #     close_room(roomCode)
  #   else:
  #     #emit updated room data to remaining players
  #     emit('room data', gameState, room=roomCode)
  # leave_room(roomCode)
  pass

#TODO: game loop function on a separate thread
def game_loop():
  global game_running
  while game_running:
    with game_lock:
      # rooms = redis_server.smembers("rooms")
      # for roomCode in rooms:
      #   if redis_server.hget(roomCode, "game_state") == "running":
      #     newTime = int(redis_server.hget(roomCode, "time"))
      #     newTime += 1
      #     redis_server.hset(roomCode, "time", newTime)
      #     gameState = redis_server.hgetall(roomCode)
      #     socketio.emit('room data', gameState, room=roomCode)
      pass
    eventlet.sleep(1)
    
#TODO: start game function
@socketio.on('start game')
def handle_start_game():
  global game_running, game_thread
  with game_lock:
    # #get room code of user
    # roomCode = redis_server.hget(f"{request.sid}", "room_code")
    # if roomCode == None:
    #   #TODO: Error handling if user is not in room
    #   return
    # #Get username
    # username = redis_server.hget(f"{request.sid}", "username")
    # if username == None:
    #   #TODO: Error handling if user doens't eixt
    #   return
    # #Get game state
    # gameState=redis_server.hgetall(roomCode)
    # if gameState == None:
    #   #TODO: Error handling if there is no game that exists
    #   return
    # #Print that user requested to run game
    # print(f"{request.sid}:{username} has requested to start the game in room:{roomCode}")
    # #Set time to 0
    # redis_server.hset(roomCode, "time", 0)
    # #Update game state to running
    # redis_server.hset(roomCode, "game_state", "running")
    # #Generate items for players to guess
    # random_string = ''.join(random.choices(string.ascii_lowercase, k=5))
    # #set items to be that string
    # redis_server.hset(roomCode, "items", random_string)
    # #reset the scores for all users in the room
    # for key in gameState:
    #   if key.startswith("user:"):
    #     user_sid = key.split(":")[1]
    #     redis_server.hset(roomCode, f"user:{user_sid}:score", 0)
    # #emit start game in case pop up is there
    # emit('start game', room=roomCode)
    # #start game loop if it isn't started
    # if not game_running:
    #   game_running = True
    #   game_thread = eventlet.spawn(game_loop)
    #   #game_thread.start()
    # gameState=redis_server.hgetall(roomCode)
    # emit('room data', gameState, room=roomCode)
    pass

#TODO: end game function on a separate thread
@socketio.on('end game')
def handle_end_game():
  global game_running
  with game_lock:
    # #get room code of user
    # roomCode = redis_server.hget(f"{request.sid}", "room_code")
    # if roomCode == None:
    #   #TODO: Error handling if user is not in room
    #   return
    # #Get username
    # username = redis_server.hget(f"{request.sid}", "username")
    # if username == None:
    #   #TODO: Error handling if user doens't eixt
    #   return
    # #Get game state
    # gameState=redis_server.hgetall(roomCode)
    # if gameState == None:
    #   #TODO: Error handling if there is no game that exists
    #   return
    # #Print that user requested to end game
    # print(f"{request.sid}:{username} has requested to end the game in room:{roomCode}")
    # #Update game state
    # redis_server.hset(roomCode, "game_state", "waiting")
    # #get game state
    # gameState=redis_server.hgetall(roomCode)
    # #TODO:logic for ending starting
    # #emit game state
    # emit('room data', gameState, room=roomCode)
    pass

#TODO: handle data submit function
@socketio.on('submit')
def handle_submit(data):
  # roomCode = redis_server.hget(f"{request.sid}", "room_code")
  # username = redis_server.hget(f"{request.sid}", "username")
  # items = redis_server.hget(roomCode, "items")
  # current_score = redis_server.hget(roomCode, f"user:{request.sid}:score")
  # current_score = int(current_score)
  # submitVal = data['submit']
  # if submitVal == items[current_score]:
  #   newScore = current_score+1
  #   redis_server.hset(roomCode, f"user:{request.sid}:score", newScore)
  #   if newScore == len(items):
  #     if redis_server.hget(roomCode, "game_state") == "running":
  #       redis_server.hset(roomCode, "game_state", "waiting")
  #       emit('winner', {'message': f"{username}"})

  # emit('room data', redis_server.hgetall(roomCode), room=roomCode)
  pass


if __name__ == '__main__':
  # Register the signal handler to close the database connection on termination
  signal.signal(signal.SIGINT, close_db)
  signal.signal(signal.SIGTERM, close_db)
  socketio.run(app, debug=True)
