messageType = {
    "userActivity": False,
    "error": True,
    "warning": True,
    "info": False,
    "debug": True
}

def log(type="debug", *args):
    if messageType[type]:
        print(*args)    

if __name__ == "__main__":
    log("debug", "Debugging is active", 1, 2, 3)
    log("info", "This is an info message")
    log("warning", "This is a warning message")
    log("error", "This is an error message")
    log("userActivity", "User activity detected")
