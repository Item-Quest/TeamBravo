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
  score INTEGER,
  room_code TEXT,
  FOREIGN KEY (room_code) REFERENCES ROOMS(room_code)
);