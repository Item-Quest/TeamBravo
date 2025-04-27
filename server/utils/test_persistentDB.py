import os
from contextlib import contextmanager
import pytest


from persistentDB import (
    temporary_db_path,
    initialize_db,
    create_user,
    find_user,
    userExists,
    geoComplete,
    geoGetScore,
    geoIsComplete,
    geoNewDay,
)

# Paths for the test database and schema
TEST_DB_PATH = "test_persistent.db"

@pytest.fixture(scope="function")
def setup_test_db():
    """
    Fixture to set up a test database and schema before each test.
    Cleans up the database file after the test.
    """
    # Create a test schema file

    # Use the temporary_db_path context manager
    with temporary_db_path(TEST_DB_PATH):
        initialize_db()
    
    yield

    # Cleanup: Remove the test database
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)

def test_create_user(setup_test_db):
    with temporary_db_path(TEST_DB_PATH):
        create_user("testuser1", "password123")
        assert userExists("testuser1") is True

def test_find_user(setup_test_db):
    with temporary_db_path(TEST_DB_PATH):
        create_user("testuser2", "password123")
        user = find_user("testuser2")
        assert user is not None
        assert user[0][1] == "testuser2"  # Assuming find_user returns a list of tuples

def test_geoComplete(setup_test_db):
    with temporary_db_path(TEST_DB_PATH):
        create_user("testuser3", "password123")
        geoComplete("testuser3")
        assert geoIsComplete("testuser3") is True

def test_geoGetScore(setup_test_db):
    with temporary_db_path(TEST_DB_PATH):
        create_user("testuser4", "password123")
        score = geoGetScore("testuser4")
        assert score == 0

def test_geoNewDay(setup_test_db):
    with temporary_db_path(TEST_DB_PATH):
        create_user("testuser5", "password123")
        geoNewDay()
        assert geoIsComplete("testuser5") is False