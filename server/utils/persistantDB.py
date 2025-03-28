import sqlite3

DB_PATH = './server/utils/persistant.db'
SCHEMA_PATH = 'server/utils/persistant_schema.sql'

def initialize_db(db_path=DB_PATH, schema_path=SCHEMA_PATH):
    """
    Initialize the SQLite database with the schema file
    example usage:
    intialize_db() # for default persistant schema and db
    initialize_db('path/to/db', 'path/to/schema') # for custom schema and db
    """
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Read the schema file
    with open(schema_path, 'r') as schema_file:
        schema = schema_file.read()

    # Execute the schema script
    cursor.executescript(schema)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
def insert_record(table_name, record, db_path=DB_PATH):
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
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Prepare the columns and values for the SQL query
    columns = ', '.join(record.keys())
    placeholders = ', '.join('?' for _ in record)
    values = tuple(record.values())

    # Create the SQL query
    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

    # Execute the query
    cursor.execute(query, values)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
def get_records(table_name, conditions=None, order_by=None, db_path=DB_PATH):
    """
    Retrieve records from the specified table in the SQLite database with optional conditions and sorting
    Example usage:
    records = get_records('table_name')
    records = get_records('table_name', conditions={'columna': valuea, 'columnb': valueb})
    records = get_records('table_name', order_by='column_name ASC')
    records = get_records('table_name', conditions={'columna': valuea}, order_by='column_name DESC')
    """
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

    # Close the connection
    conn.close()

    return records


def save_score(username, score, game_mode):
    user = find_user(username)
    if(user):
        record = {
            'user_id': user[0][0],
            'score': score,
            'game_mode': game_mode
        }
        insert_record("scores", record)
    else:
        #TODO: error handiling for user not found
        pass

def get_top_scores(game_mode=-1, orderBy=None):
    if(game_mode == -1):
        return get_records("scores", None, orderBy)
    else:
        return get_records("scores", {'game_mode': game_mode}, orderBy)

def get_user_scores(username, game_mode=-1):
    if(game_mode == -1):
        return get_records("scores", {'username': username})
    else:
        get_records("scores", construct_condition("username", username, "game_mode", game_mode))
def construct_record(columns, values):
    '''helper function combine a list of column names and values if too lazy to make yourself
    usage:  construct_record({'columnA', 'columnB', 'columnN'}, {valueA, valueB, valueN})
    returns {'columna': valueA, 'columnb': valueB, 'columnN': valueN}
    '''
    return dict(zip(columns, values))
def construct_condition(columns, values):
    '''different name for construct record, inherently the same'''
    return construct_record(columns, values)

def get_username(id):
    return get_records("users", {'id': id})[0][1]

def find_user(username):
    return get_records("users", {'username': username})

def matchPassword(username, password):
    user = find_user(username)
    if(user):
        return user[0][2] == password
    else:
        return False
    
def userExists(username):
    return find_user(username) != []

def create_user(username, password="Password"):
    insert_record("users", {'username': username, 'password': password})

def construct_leaderboard_entry(record):
  '''
  create a readable scoreboard entry directly from a record from the score table in the memroy db
  usage construct_leaderboard_entry(record)
  '''
  user = get_username(record[1])
  if(record[4] == 0):
    game_mode = "Classic"
  else:
    game_mode = "noGameError"
  score = record[2]
  return [user, score, game_mode]

if __name__ == "__main__":
    initialize_db()