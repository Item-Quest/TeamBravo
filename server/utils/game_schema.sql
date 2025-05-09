-- TODO: GET TABLES IN THIRD NORMAL
CREATE TABLE IF NOT EXISTS ROOMS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_code TEXT UNIQUE,
  game_state TEXT,
  items TEXT, -- JSON encoded string
  time_in_game INTEGER DEFAULT 0,
  game_mode TEXT
);

CREATE TABLE IF NOT EXISTS USERS(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  socket_id TEXT UNIQUE,
  username TEXT,
  score INTEGER, -- score == amount of items correct
  room_code TEXT,
  join_num INTEGER DEFAULT -1, --For tracking if user is in a room or not

  FOREIGN KEY (room_code) REFERENCES ROOMS(room_code)
);

CREATE TABLE IF NOT EXISTS ROOM_ITEMS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_code TEXT,
  item_name TEXT,

  FOREIGN KEY (room_code) REFERENCES ROOMS(room_code)
);