import os
import sqlite3
import pytest
from persistantDB import initialize_db, insert_record

TEST_DB_PATH = 'test_persistant.db'
TEST_SCHEMA_PATH = 'test_persistant_schema.sql'

@pytest.fixture(scope='module')
def setup_db():
    # Create a test schema file
    schema_content = """
    CREATE TABLE test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value TEXT NOT NULL
    );
    """
    with open(TEST_SCHEMA_PATH, 'w') as f:
        f.write(schema_content)

    # Initialize the test database
    initialize_db(db_path=TEST_DB_PATH, schema_path=TEST_SCHEMA_PATH)

    yield

    # Teardown: Remove the test database and schema file
    os.remove(TEST_DB_PATH)
    os.remove(TEST_SCHEMA_PATH)

def test_initialize_db(setup_db):
    # Check if the database file is created
    assert os.path.exists(TEST_DB_PATH)

    # Check if the table is created
    conn = sqlite3.connect(TEST_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='test_table';")
    table = cursor.fetchone()
    conn.close()

    assert table is not None

def test_insert_record(setup_db):
    # Insert a record into the test table
    record = {'name': 'test_name', 'value': 'test_value'}
    insert_record('test_table', record, db_path=TEST_DB_PATH)

    # Check if the record is inserted
    conn = sqlite3.connect(TEST_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM test_table WHERE name='test_name' AND value='test_value';")
    inserted_record = cursor.fetchone()
    conn.close()

    assert inserted_record is not None
    assert inserted_record[1] == 'test_name'
    assert inserted_record[2] == 'test_value'

# We recommend installing an extension to run python tests.