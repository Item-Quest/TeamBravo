CREATE TABLE if not EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE if not EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    message TEXT NOT NULL,
    sender_user_id INTEGER,
    created_at TIMESTAMP,
    FOREIGN KEY (sender_user_id) REFERENCES users(id)
);

CREATE TABLE if not EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    user_id INTEGER,
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_mode INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);