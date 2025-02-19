.PHONY: all run build buildS buildC clean

ifeq ($(OS),Windows_NT)
    ENVIRONMENT_PATH = server/environment/Scripts
else
    ENVIRONMENT_PATH = server/environment/bin
endif

all: clean build run

run:
	@-$(ENVIRONMENT_PATH)/python3 server/app.py

build: buildS buildC

buildC:
	@-npm i --prefix client
	@-npm run build --prefix client

buildS:
	@-python3 -m venv server/environment
	@-$(ENVIRONMENT_PATH)/pip install flask flask-socketio eventlet redis

clean:
	@-rm -r client/dist
	@-rm -r client/node_modules
	@-rm -r server/environment