import socket from './socket';

function socketCallWrapper(requestMessage, requestData, responseMessage, responseCallback) {
    if (responseMessage) {
        socket.off(responseMessage);
        socket.on(responseMessage, (response) => {
            if (responseCallback)
                responseCallback(response);
        });
    }
    if (requestMessage) {
        if (requestData != null && requestData != undefined)
            socket.emit(requestMessage, requestData);
        else 
            socket.emit(requestMessage);
    }
}

export function updateUsername(username) {
    socketCallWrapper('username change', {data: username});
}

export function createGame(gameMode,callback) {
    // socket.emit('username change', {data: username});
    socketCallWrapper('create game', {mode: gameMode}, 'game created', (result) => {
        if (callback)
            callback(result);
    });
}

export function joinGame(roomCode, callback) {
    socketCallWrapper('join attempt', {roomcode: roomCode}, 'join response', (result) => {
        // if (result.success)
        //     socket.emit('username change', {data: username});
        if (callback)
            callback(result);
    });
}

export function getAllPlayers(callback) {
    socketCallWrapper('all users', null, 'all users response', callback);
 };


export function connectGame(callback) {
    socketCallWrapper('connect game', null, 'room data', (result) => {
        if (callback)
            callback(result);
    });
}

export function getTopScores(gameMode, callback) {
    socketCallWrapper('get top scores', gameMode, 'top scores', callback);
}

export function getGameMode(callback) {
    socketCallWrapper('get gamemode', null, 'game mode response', (response) => {
        if (response && response.game_mode) {
            callback(response.game_mode); // Pass the gameMode string to the callback
        } else {
            console.error("Game mode not found in response:", response);
            callback(null); // Pass null if gameMode is not found
        }
    });
}
export function geoGetInfo(callback) {
    socketCallWrapper('geoquest get info', null, 'geoquest get info response', callback);
}

export function whoAmI(callback) {
    socketCallWrapper('who am i', null, 'who am i response', callback);
}

export function getUserinfo(callback) {
    console.log("getUserinfo called");
    socketCallWrapper('get userinfo', null, 'userinfo response', callback);
}


//geoquest functions
export function getGeoItem(callback) {
    socketCallWrapper('get geo item', null, 'geo item', callback);
    return callback;
}

export function submitGeoquest(callback) {
    socket.emit('geosubmit', null);
}

export function geoGetScore(callback) {
    socketCallWrapper('geoquest get score', null, 'geoquest get response', callback);
}

export function geoIsComplete(callback) {
    socketCallWrapper('geoquest is complete', null, 'geoquest is complete response', callback);
}