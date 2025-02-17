import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/login.css'
import socket from '../socket';
import '../App.css'


export default function JoinModal({ isOpen, onClose }) {
  if (!isOpen) return null; 
  const [username, setUsername] = useState("Anonymous"); /* Set Username to Anonymus if nothing is entered */
  const [roomcode, setRoomCode] = useState("");
  const [error, setError] = useState(""); /* For no-room-code error */
  const navigate = useNavigate();

  function updateUsername(event){
    setUsername(event.target.value);
  }

  function updateRoomCode(event){
    setRoomCode(event.target.value);
  }

  function clickPlay(){
    if(roomcode.trim()){
    socket.emit('receive username ', {data: username});
    socket.emit('receive roomcode', {data: roomcode});
    navigate("/play");
    /* alert (`Username: ${username}\nRoom Code: ${roomcode}`); /* Optional alert to display username and roomcode entered */
    }
    else setError("Room code is required.");  /* Alerts if a roomcode is not entered */
  }

  return (
    <>
        <div className="join-modal">
          <div onClick={onClose} className="join-overlay"></div> {/* Popup closes if clicked outside of it */}
          <div className="join-modal-content">
          <h2 className = "join-title">Join Room</h2>
          <input className="join-input" onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
            <input className="join-input" onChange = {updateRoomCode} type="text" placeholder="Enter Room Code"></input>
            {error && <p className="error-message">{error}</p>} {/* Show error if room code is not entered */}
            <button className="join-button-play" onClick={clickPlay}>Play</button>
            <button className="join-close-modal" onClick={onClose}>&times;</button>
          </div>
        </div>
      
    </>
  );
}
