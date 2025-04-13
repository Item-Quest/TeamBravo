.PHONY: all run runC build buildS buildC clean testdb

#make all -> cleans client and server folder, sets up both for running, runs the serverr
#make run -> runs the server | assumes you've already compiled
#make runC -> runs the client development server for front end dev purposes
#make build -> sets up client and server to be run
#make buildC -> installs npm modules for client
#make clean -> cleans the client and server folders

ifeq ($(OS),Windows_NT)
    ENVIRONMENT_PATH = server/environment/Scripts
else
    ENVIRONMENT_PATH = server/environment/bin
endif

all: clean build run

run:
	@-$(ENVIRONMENT_PATH)/python3 server/app.py

runC:
	@-npm run dev --prefix client

build: buildC buildS

buildC:
	@-npm i --prefix client

buildS:
	@-npm run build --prefix client
	@-python3 -m venv server/environment
	@-$(ENVIRONMENT_PATH)/pip install flask flask-socketio eventlet APScheduler

testdb:
	@-python3 ./server/utils/memoryDB.py

clean:
	@-rm -r client/dist
	@-rm -r client/node_modules
	@-rm -r server/environment