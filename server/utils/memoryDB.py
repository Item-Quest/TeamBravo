import sqlite3
import json
import os
import time

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

def db_set_user_score(cursor, socket_id, score):
  try:
    sql = '''UPDATE users SET score = ? WHERE socket_id = ?'''
    values = [score, socket_id]
    cursor.execute(sql,values)
  except sqlite3.Error as e:
    print(f"db_set_user_room error:{e}")


def db_room_exists(cursor, room_code):
  cursor.execute('SELECT 1 FROM rooms WHERE room_code = ?', (room_code,))
  return cursor.fetchone() is not None

def db_get_rooms(cursor):
  cursor.execute('SELECT * FROM rooms')
  return cursor.fetchall()

def db_get_users(cursor):
  cursor.execute('SELECT * from users')
  return cursor.fetchall()
