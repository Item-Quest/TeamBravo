import sqlite3

DB_PATH = 'persistant.db'
SCHEMA_PATH = 'persistant_schema.sql'

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
    def get_records(table_name, conditions=None, db_path=DB_PATH):
        """
        Retrieve records from the specified table in the SQLite database with optional conditions
        Example usage:
        records = get_records('table_name')
        records = get_records('table_name', conditions={'column1': 'value1', 'column2': 'value2'})
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

        # Execute the query
        cursor.execute(query, values)

        # Fetch all the records
        records = cursor.fetchall()

        # Close the connection
        conn.close()

        return records

if __name__ == "__main__":
    pass