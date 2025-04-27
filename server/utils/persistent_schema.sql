CREATE TABLE if not EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
CREATE TABLE if not EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
    user_id INTEGER,
    score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_mode INTEGER,
    place integer,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE if NOT EXISTS geoQuestData (
    playerId INTEGER Primary Key,
    score INTEGER,
    completed BOOLEAN,
    lastIncomplete TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playerId) REFERENCES users(id)
);