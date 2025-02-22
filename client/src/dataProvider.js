import socket from './socket';

const isMockup = false;
var mockupData = {
    username: "Anonymous",
    roomcode: null,
    userSid: null
};

function socketCallWrapper(requestMessage, requestData, responseMessage, responseCallback) {
    debugger;
    if (responseMessage) {
        socket.off(responseMessage);
        socket.on(responseMessage, (response) => {
            debugger;
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
    if (isMockup) {
        mockupData.username = username;
        return;
    }

    socketCallWrapper('username change', {data: username});
}

export function createGame(username, callback) {
    debugger;
    if (isMockup) {
        mockupData.username = username;
        mockupData.userSid = 123;
        if (callback)
            callback(mockupData.userSid);
        return;
    }

    socketCallWrapper('create game', null, 'game created', (result) => {
        debugger;
        if (username)
            socket.emit('username change', {data: username});
        if (callback)
            callback(result);
    });
}


//------------------------------------------------
export function getAllPlayers() {
    if (isMockup)
        return [
            {Id: 1, Name: "Joe", Score: 45},
            {Id: 2, Name: "Anna", Score: 40},
            {Id: 3, Name: "Alex", Score: 35},
            {Id: 4, Name: "Kate", Score: 30}
           ];
           
     //backend logic here 
     return [];
 };

export async function getLeaderboardData() {
    if (isMockup)
        return [
            {Id: 1, Name: "Joe", Score: 45},
            {Id: 2, Name: "Anna", Score: 40},
            {Id: 3, Name: "Alex", Score: 35},
            {Id: 4, Name: "Kate", Score: 30}
        ];
        
    const response = await fetch('/api/leaderboard');
    const data = await response.json();

    if (response.ok) {
        return data.leaderboard;
    } else {
        console.error('Error fetching leaderboard data:', data.message);
        return [];
    }
}
