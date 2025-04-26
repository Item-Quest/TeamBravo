import sqlite3
import os
from contextlib import contextmanager

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "persistent.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "persistent_schema.sql")

@contextmanager
def temporary_db_path(temp_DB):
    """
    Context manager to temporarily change the DB_PATH for the duration of execution.
    Usage:
    with temporary_db_path("path/to/temp.db", "path/to/temp_schema.sql"):
        # Perform operations with the temporary DB_PATH and SCHEMA_PATH
    """
    global DB_PATH
    original_db_path = DB_PATH
    DB_PATH = os.path.join(BASE_DIR, temp_DB)
    try:
        yield
    finally:
        DB_PATH = original_db_path

def get_DB_path():
    return BASE_DIR, DB_PATH, SCHEMA_PATH

def initialize_db(db_path=None, schema_path=SCHEMA_PATH, schemaString=None):
    """
    Initialize the SQLite database with the schema file.
    """
    db_path = db_path or DB_PATH
    try:
        # Read the schema file
        with open(schema_path, "r") as schema_file:
            schema = schema_file.read()

        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Execute the schema script
        cursor.executescript(schema)

        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"SQLite error during initialize_db: {e}")
        if conn:
            conn.close()

# "_" marks function as private, ensures inetended use through other functions.
def _insert_record(table_name, record, db_path=None):
    """
    Insert a record into the specified table in the SQLite database
    Example usage:
    record = {
        'column1': 'value1',
        'column2': 'value2',
        'column3': 'value3'
    }
    insert_record('table_name', record)
    """
    db_path = db_path or DB_PATH
    try:
        print(record)
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Prepare the columns and values for the SQL query
        columns = ", ".join(record.keys())
        placeholders = ", ".join("?" for _ in record)
        values = tuple(record.values())

        # Create the SQL query
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

        # Execute the query
        cursor.execute(query, values)

        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"table_name: {table_name}")
        print(f"Record: {record}")
        print(f"aSQLite error during insert_record: {e}")
    finally:
        conn.close()
        


# "_" marks function as private, ensures inetended use through other functions.
def _get_records(table_name, conditions=None, order_by=None, db_path=None):
    """
    Retrieve records from the specified table in the SQLite database with optional conditions and sorting.
    """
    db_path = db_path or DB_PATH
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Create the base SQL query
        query = f"SELECT * FROM {table_name}"

        # Add conditions if provided
        if conditions:
            condition_strings = [f"{column} = ?" for column in conditions.keys()]
            condition_clause = " AND ".join(condition_strings)
            query += f" WHERE {condition_clause}"
            values = tuple(conditions.values())
        else:
            values = ()

        # Add order by clause if provided
        if order_by:
            query += f" ORDER BY {order_by}"

        # Execute the query
        cursor.execute(query, values)

        # Fetch all the records
        records = cursor.fetchall()
        
        return records
        conn.close()
    except sqlite3.Error as e:
        print(f"SQLite error during _get_records: {e}")
        if conn:
            conn.close()

    return records

def _altar_records(table_name, record, conditions, db_path=None):
    """
    Function to alter a record in the database.
    Updates only the columns provided in the `record` dictionary.
    """
    db_path = db_path or DB_PATH
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Prepare the SET clause for the SQL query
        set_clause = ", ".join(f"{column} = ?" for column in record.keys())
        set_values = tuple(record.values())

        # Prepare the WHERE clause
        if conditions:
            condition_clause = " AND ".join(f"{column} = ?" for column in conditions.keys())
            condition_values = tuple(conditions.values())
            query = f"UPDATE {table_name} SET {set_clause} WHERE {condition_clause}"
            values = set_values + condition_values
        else:
            # If no conditions are provided, update all rows
            query = f"UPDATE {table_name} SET {set_clause}"
            values = set_values

        # Execute the query
        cursor.execute(query, values)

        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"SQLite error during _altar_records: {e}")
        if conn:
            conn.close()
        

def _increment_record_values(table_name, column, increment_by, conditions, db_path=None):
    """
    Increment a specific column's value in the database without retrieving the record.
    """
    db_path = db_path or DB_PATH
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Prepare the WHERE clause
        condition_clause = " AND ".join(f"{col} = ?" for col in conditions.keys())
        condition_values = tuple(conditions.values())

        # Create the SQL query to increment the value
        query = f"UPDATE {table_name} SET {column} = {column} + ? WHERE {condition_clause}"

        # Execute the query
        cursor.execute(query, (increment_by,) + condition_values)

        # Commit the changes and close the connection
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"SQLite error during _increment_record_values: {e}")
        if conn:
            conn.close()
  

def save_score(username, score, game_mode, place):
    print("saving score")
    user = find_user(username)
    if user:
        record = {"user_id": user[0][0], "score": score, "game_mode": game_mode, 'place': place}

        _insert_record("scores", record)
        print('score saved')
    else:
        # TODO: error handiling for user not found
        pass
    


def get_top_scores(game_mode=-1, orderBy=None):
    if game_mode == -1:
        return _get_records("scores", None, orderBy)
    else:
        return _get_records("scores", {"game_mode": game_mode}, orderBy)


def get_user_scores(username, game_mode=-1):
    if game_mode == -1:
        return _get_records("scores", {"username": username})
    else:
        _get_records(
            "scores", construct_condition("username", username, "game_mode", game_mode)
        )


def construct_record(columns, values):
    """helper function combine a list of column names and values if too lazy to make yourself
    usage:  construct_record({'columnA', 'columnB', 'columnN'}, {valueA, valueB, valueN})
    returns {'columna': valueA, 'columnb': valueB, 'columnN': valueN}
    """
    return dict(zip(columns, values))


def construct_condition(columns, values):
    """different name for construct record, inherently the same"""
    return construct_record(columns, values)


def get_username(id):
    return _get_records("users", {"id": id})[0][1]


def find_user(username):
    user = get_records("users", {"username": username})
    if user:
        return user


def matchPassword(username, password):
    user = find_user(username)
    if user:
        return user[0][2] == password
    else:
        return False


def userExists(username):
    return find_user(username) != []

def create_user(username, password="Password"):
    _insert_record("users", {"username": username, "password": password})
    #create associated geoquest record
    _insert_record("geoquestdata", {"playerId": find_user(username)[0][0], "score": 0, "completed": False})

#functions for geoquest
def geoComplete(username):
    '''called when a user completes the geoquest game increments score and sets complete to true
        usage: GeoComplete(username)
    '''
    playerId = find_user(username)[0][0] #first field of first record is the id
    if playerId:
        _altar_records("geoquestdata", {"completed": True}, {"playerId": playerId})
        _increment_record_values("geoquestdata", "score", 1, {"playerId": playerId}) #increment score by 1
    
def geoGetScore(username):
    '''returns the score of the user in the geoquest game
        usage: GeoGetScore(username)
    '''
    playerId = find_user(username)[0][0]
    if playerId:
        return _get_records("geoquestdata", {"playerId": playerId})[0][1]

def geoIsComplete(username):
    '''returns true if the user has completed the geoquest false if not complete
        usage: GeoIsComplete(username)
    '''
    playerId = find_user(username)[0][0]
    if playerId:
        res = _get_records("geoquestdata", {"playerId": playerId})[0][2]
        return res == 1

def geoNewDay():
    '''called when a new day starts,sets completed to false
        usage: GeoNewDay()
    '''
    _altar_records("geoquestdata", {"completed": False}, {})
    insert_record("users", {"username": username, "password": password})


def construct_leaderboard_entry(record):
    """
    create a readable scoreboard entry directly from a record from the score table in the memroy db
    usage construct_leaderboard_entry(record)
    """
    user = get_username(record[1])
    if record[4] == 0:
        game_mode = "Classic"
    else:
        game_mode = "noGameError"
    score = record[2]
    return [user, score, game_mode]

def get_user_scores(username, game_mode=-1):
    print(username)
    if username == "Anonymous" or not userExists(username) :
        return None
    userid = find_user(username)[0][0]
    if game_mode == -1:
        return get_records("scores", {"user_id": userid})
    else:
        return get_records(
            "scores", construct_condition("user_id", userid, "game_mode", game_mode)
        )

if __name__ == "__main__":
    initialize_db()


