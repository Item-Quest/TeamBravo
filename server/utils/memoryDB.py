import sqlite3
import json
import os
import time

#initialize database
def init_game_db():
  #connect to in memory database
  connection = sqlite3.connect(':memory:')
  #create cursor object to execute sql commands
  cursor = connection.cursor()

  #read schema from game_schema.sql
  schema_path = os.path.join(os.path.dirname(__file__), 'game_schema.sql')
  with open(schema_path, 'r') as f:
    schema = f.read()
  cursor.executescript(schema)

  return connection, cursor

def add_room(cursor, room_code, game_state, items, time_in_game):
  try:
    sql = '''INSERT INTO rooms(room_code, game_state, items, time_in_game)
            VALUES(?,?,?,?)'''
    values = [room_code, game_state, json.dumps(items), time_in_game]
    cursor.execute(sql, values)
    print(f"Room successfully added")
  except sqlite3.Error as e:
    print(f"Room creation error occurred: {e}")

def add_user(cursor, socket_id, score, room_code):
  try:
    sql = '''INSERT INTO users(socket_id, score, room_code)
        VALUES(?,?,?)'''
    values = [socket_id, score, room_code]
    cursor.execute(sql, values)
    print("user successfully added")
  except sqlite3.Error as e:
    print(f"User creation error: {e}")

def get_rooms(cursor):
  cursor.execute('SELECT * FROM rooms')
  return cursor.fetchall()

def get_users(cursor):
  cursor.execute('SELECT * from users')
  return cursor.fetchall()

# sample data to add
connection, cursor = init_game_db()

add_room(cursor, 'ROOM123', 'waiting', ['a','b','c'], 0)
add_user(cursor, 'socket123', 100, 'room123')

connection.commit()
start_time = time.time()
rooms = get_rooms(cursor)
end_time = time.time()
print(end_time - start_time)
users = get_users(cursor)

print('Rooms:')
for room in rooms:
  room_id, room_code, game_state, items_json, time_in_game = room
  items = json.loads(items_json)  # Dejsonify the items column
  print(f"Room ID: {room_id}, Room Code: {room_code}, Game State: {game_state}, Items: {items}, Time in Game: {time_in_game}")

print('Users:')
for user in users:
  user_id, socket_id, score, room_code = user
  print(f"User ID: {user_id}, Socket ID: {socket_id}, Score: {score}, Room Code: {room_code}")

connection.close()

