CREATE TABLE if not EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
CREATE TABLE if not EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    user_id INTEGER,
    score TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_mode INTEGER,
    place integer,
    FOREIGN KEY (user_id) REFERENCES users(id)
);