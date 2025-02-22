import unittest
import sqlite3
import json
import os

from memoryDB import (
  db_init_game_db,
  db_add_room,
  db_get_roomCodes,
  db_room_exists,
  db_room_empty,
  db_delete_room,
  db_add_user,
  db_delete_user,
  db_set_username,
  db_get_username,
  db_set_user_roomCode,
  db_get_user_roomCode,
  db_set_user_score,
  db_get_game_state,
  db_get_rooms,
  db_get_users
)

class TestMemoryDB(unittest.TestCase):

  def setUp(self):
    self.connection, self.cursor = db_init_game_db()
    self.room_code = "room1"
    self.game_state = "active"
    self.items = {"item1": 1, "item2": 2}
    self.time_in_game = 100
    self.socket_id = "socket1"
    self.username = "user1"
    self.score = 10

  def tearDown(self):
    self.connection.close()

  def test_db_add_room(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    self.cursor.execute("SELECT * FROM rooms WHERE room_code = ?", [self.room_code])
    room = self.cursor.fetchone()
    self.assertIsNotNone(room)
    self.assertEqual(room[1], self.room_code)
    self.assertEqual(room[2], self.game_state)
    self.assertEqual(json.loads(room[3]), self.items)
    self.assertEqual(room[4], self.time_in_game)

  def test_db_get_roomCodes(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    room_codes = db_get_roomCodes(self.cursor)
    self.assertIn((self.room_code,), room_codes)

  def test_db_room_exists(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    exists = db_room_exists(self.cursor, self.room_code)
    self.assertEqual(exists, self.room_code)

  def test_db_room_empty(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    empty = db_room_empty(self.cursor, self.room_code)
    self.assertTrue(empty)

  def test_db_delete_room(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    db_delete_room(self.cursor, self.room_code)
    self.cursor.execute("SELECT * FROM rooms WHERE room_code = ?", [self.room_code])
    room = self.cursor.fetchone()
    self.assertIsNone(room)

  def test_db_add_user(self):
    result = db_add_user(self.cursor, self.socket_id, self.username, self.score)
    self.assertTrue(result)
    self.cursor.execute("SELECT * FROM users WHERE socket_id = ?", [self.socket_id])
    user = self.cursor.fetchone()
    self.assertIsNotNone(user)
    print("adsfadsf ", user)
    self.assertEqual(user[2], self.username)
    self.assertEqual(user[3], self.score)

  def test_db_delete_user(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    db_delete_user(self.cursor, self.socket_id)
    self.cursor.execute("SELECT * FROM users WHERE socket_id = ?", [self.socket_id])
    user = self.cursor.fetchone()
    self.assertIsNone(user)

  def test_db_set_username(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    new_username = "user2"
    db_set_username(self.cursor, self.socket_id, new_username)
    self.cursor.execute("SELECT username FROM users WHERE socket_id = ?", [self.socket_id])
    username = self.cursor.fetchone()[0]
    self.assertEqual(username, new_username)

  def test_db_get_username(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    username = db_get_username(self.cursor, self.socket_id)
    self.assertEqual(username, self.username)

  def test_db_set_user_room(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    db_set_user_roomCode(self.cursor, self.socket_id, self.room_code)
    self.cursor.execute("SELECT room_code FROM users WHERE socket_id = ?", [self.socket_id])
    room_code = self.cursor.fetchone()[0]
    self.assertEqual(room_code, self.room_code)

  def test_db_get_user_room(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    db_set_user_roomCode(self.cursor, self.socket_id, self.room_code)
    room_code = db_get_user_roomCode(self.cursor, self.socket_id)
    self.assertEqual(room_code, self.room_code)

  def test_db_set_user_score(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    new_score = 20
    db_set_user_score(self.cursor, self.socket_id, new_score)
    self.cursor.execute("SELECT score FROM users WHERE socket_id = ?", [self.socket_id])
    score = self.cursor.fetchone()[0]
    self.assertEqual(score, new_score)

  def test_db_get_game_state(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    db_set_user_roomCode(self.cursor, self.socket_id, self.room_code)
    game_state = db_get_game_state(self.cursor, self.room_code)
    self.assertIsNotNone(game_state)
    self.assertEqual(game_state['room_code'], self.room_code)
    self.assertEqual(game_state['game_state'], self.game_state)
    self.assertEqual(game_state['items'], self.items)
    self.assertEqual(game_state['time'], self.time_in_game)
    self.assertEqual(game_state[f'user:{self.socket_id}:username'], self.username)
    self.assertEqual(game_state[f'user:{self.socket_id}:score'], self.score)

  def test_db_get_rooms(self):
    db_add_room(self.cursor, self.room_code, self.game_state, self.items, self.time_in_game)
    rooms = db_get_rooms(self.cursor)
    self.assertIn((1, self.room_code, self.game_state, json.dumps(self.items), self.time_in_game), rooms)

  def test_db_get_users(self):
    db_add_user(self.cursor, self.socket_id, self.username, self.score)
    users = db_get_users(self.cursor)
    self.assertIn((1, self.socket_id, self.username, self.score, "None"), users)

if __name__ == '__main__':
  unittest.main()