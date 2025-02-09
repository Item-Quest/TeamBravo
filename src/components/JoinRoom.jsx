import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from './Camera';
import { io } from 'socket.io-client';

const JoinRoom = props => {
    
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [roomCode, setRoomCode] = useState("");


    const playClick = () => {
        if (username && roomCode) {
            socket.emit("receive username", {username});
            alert(`Play was clicked. Room code: ${roomCode}, Username: ${username}`);
            navigate("/play");
          } else {
            alert("Please enter both username and room code.");
          }
        };


    return (
        <div className='JoinRoom'>
            <div className='JoinRoom-buttons-panel'>
                <input className='JoinRoom-menu-button' placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)}/>
                <input className='JoinRoom-menu-button' placeholder="Enter Room Code" value={roomCode} onChange={e => setRoomCode(e.target.value)}/>
                <button className='JoinRoom-menu-button' onClick={playClick}>Play</button>
            </div>
        </div>
    )
}
export default JoinRoom