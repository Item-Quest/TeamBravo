import sqlite3
import json
import os
import time
#TODO: create list of functions and describe what they do so excessive scrolling is not a problem
#TODO: add comments
#initialize database
def db_init_game_db():
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

def db_add_room(cursor, room_code, game_state, items, time_in_game):
  try:
    sql = '''INSERT INTO rooms(room_code, game_state, items, time_in_game)
            VALUES(?,?,?,?)'''
    values = [room_code, game_state, json.dumps(items), time_in_game]
    cursor.execute(sql, values)
  except sqlite3.Error as e:
    print(f"db_add_room error: {e}")

#checks if a room exists in rooms
def db_room_exists(cursor, room_code):
  try:
    sql = '''SELECT room_code FROM rooms WHERE room_code = ?'''
    cursor.execute(sql,[room_code])
    res = cursor.fetchone()
    if res:
      return res[0]
    return None
  except sqlite3.Error as e:
    print(f"db_check_rooms_room: {e}")

def db_room_empty(cursor, room_code):
  try:
    sql = '''Select socket_id FROM users where room_code = ?'''
    cursor.execute(sql,[room_code])
    res = cursor.fetchall()
    if not res:
      return True
    return False
  except sqlite3.Error as e:
    print(f"db_room_empty error: {e}")
    return False
  
def db_set_room_time(cursor, room_code, time):
  try:
    sql = '''UPDATE rooms SET time_in_game = ? WHERE room_code = ?'''
    cursor.execute(sql, [time, room_code])
  except sqlite3.Error as e:
    print(f"db_set_room_time error: {e}")

def db_get_room_time(cursor, room_code):
  try:
    sql = '''SELECT time_in_game FROM rooms WHERE room_code = ?'''
    cursor.execute(sql, [room_code])
    return cursor.fetchone()
  except sqlite3.Error as e:
    print(f"db_set_room_time error: {e}")

def db_set_room_game_state(cursor, room_code, setting):
  try:
    sql = '''UPDATE rooms SET game_state = ? WHERE room_code = ?'''
    cursor.execute(sql, [setting, room_code])
  except sqlite3.Error as e:
    print(f"db_set_room_game_state error: {e}")

def db_delete_room(cursor, room_code):
  try:
    sql = '''DELETE FROM rooms WHERE room_code = ?'''
    cursor.execute(sql, [room_code])
  except sqlite3.Error as e:
    print(f"db_delete_room error: {e}")

def db_add_user(cursor, socket_id, username, score):
  try:
    sql = '''INSERT INTO users(socket_id, username, score, room_code)
        VALUES(?,?,?,?)'''
    values = [socket_id, username, score, "None"]
    cursor.execute(sql, values)
    return True
  except sqlite3.Error as e:
    print(f"db_add_user error: {e}")
    return False
  
def db_delete_user(cursor, socket_id):
  try:
    sql = '''DELETE FROM users WHERE socket_id = ?'''
    cursor.execute(sql,[socket_id])
  except sqlite3.Error as e:
    print(f"db_delete_user error: {e}")

def db_set_username(cursor, socket_id, username):
  try:
    sql = '''UPDATE users SET username = ? WHERE socket_id = ?'''
    values = [username, socket_id]
    cursor.execute(sql, values)
  except sqlite3.Error as e:
    print(f"Udb_set_username error:{e}")

def db_get_username(cursor, socket_id):
  try:
    sql = '''SELECT username FROM users WHERE socket_id = ?'''
    cursor.execute(sql, [socket_id])
    res = cursor.fetchone()
    if res:
      return res[0]
    return None
  except sqlite3.Error as e:
    print(f"db_get_username error:{e}")
    return None

def db_set_user_room(cursor, socket_id, roomCode):
  try:
    sql = '''UPDATE users SET room_code = ? WHERE socket_id = ?'''
    values = [roomCode, socket_id]
    cursor.execute(sql,values)
  except sqlite3.Error as e:
    print(f"db_set_user_room error:{e}")

def db_get_user_score(cursor, socket_id):
  try:
    sql = '''SELECT score FROM users WHERE socket_id = ?'''
    cursor.execute(sql, [socket_id])
    return cursor.fetchone()
  except sqlite3.Error as e:
    print(f"db_get_user_score error: {e}")

def db_get_user_room(cursor, socket_id):
  try:
    sql = '''SELECT room_code FROM  users WHERE socket_id = ?'''
    cursor.execute(sql, [socket_id])
    res = cursor.fetchone()
    if res:
      return res[0]
    return None
  except sqlite3.Error as e:
    print(f"db_get_user_room error:{e}")
    return None
  

def db_set_user_score(cursor, socket_id, score):
  try:
    sql = '''UPDATE users SET score = ? WHERE socket_id = ?'''
    values = [score, socket_id]
    cursor.execute(sql,values)
  except sqlite3.Error as e:
    print(f"db_set_user_room error:{e}")

def db_get_game_state(cursor, room_code):
  try:
    #grab users from users
    sql = '''SELECT * FROM users WHERE room_code = ?'''
    cursor.execute(sql, [room_code])
    users = cursor.fetchall()
    #grab game_state from rooms
    sql = '''Select * from rooms WHERE room_code = ?'''
    cursor.execute(sql,[room_code])
    room_data = cursor.fetchone()
    if not room_data:
      return None
    _, roomCode, gameState, items, time, gameMode= room_data
    game_data = {
      'room_code': roomCode,
      'game_state': gameState,
      'items': json.loads(items),
      'time': time,
      'gameMode': gameMode
    }
    for user in users:
      _, socket_id, username, score, roomCode = user
      game_data[f'user:{socket_id}:username'] = username
      game_data[f'user:{socket_id}:score'] = score
    return game_data
  except sqlite3.Error as e:
    print(f"db_get_game_state error: {e}")
    return None

def db_set_room_items(cursor, room_code, items):
  try:
    sql = '''UPDATE rooms SET items = ? WHERE room_code = ?'''
    cursor.execute(sql, [items, room_code])
  except sqlite3.Error as e:
    print(f"db_set_room_items error: {e}")

def db_get_room_items(cursor, room_code):
  try:
    sql = '''SELECT items FROM rooms WHERE room_code = ?'''
    cursor.execute(sql, [room_code])
    return cursor.fetchone()
  except sqlite3.Error as e:
    print(f"db_set_room_items error: {e}")


def db_set_room_user_scores(cursor, room_code, score):
  try:
    sql = '''UPDATE users SET score = ? WHERE room_code = ?'''
    cursor.execute(sql, [score, room_code])
  except sqlite3.Error as e:
    print(f"db_set_room_items error: {e}")

def db_get_game_mode(room_code):
  return "itemRace"

def db_get_rooms(cursor):
  cursor.execute('SELECT * FROM rooms')
  return cursor.fetchall()

def db_get_users(cursor):
  cursor.execute('SELECT * from users')
  users = cursor.fetchall()
  result = []
  for user in users:
      _, socket_id, username, score, roomCode = user
      userData = {'Id':socket_id, 'Name': username, 'Score': score}
      result.append(userData)
  return result

def db_get_users_in_room_by_score(cursor, room_code):
  try:
    sql = '''SELECT * FROM users WHERE room_code = ? ORDER BY score DESC'''
    cursor.execute(sql, [room_code])
    return cursor.fetchall()  
  except sqlite3.Error as e:
    print(f"db_get_users_in_room error: {e}")
    return None