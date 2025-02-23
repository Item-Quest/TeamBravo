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

export function createGame(username, callback) {
    socketCallWrapper('create game', null, 'game created', (result) => {
        socket.emit('username change', {data: username});
        if (callback)
            callback(result);
    });
}

export function joinGame(username, roomCode, callback) {
    socketCallWrapper('join attempt', {roomcode: roomCode}, 'join response', (result) => {
        if (result.success)
            socket.emit('username change', {data: username});
        if (callback)
            callback(result);
    });
}

export function getAllPlayers(callback) {
    socketCallWrapper('all users', null, 'all users response', callback);
 };


