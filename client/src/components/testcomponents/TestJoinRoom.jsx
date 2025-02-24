import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import socket from '../../socket';

const JoinModal = ({isOpen, onClose}) =>{
  if (!isOpen) return null; 
  const [username, setUsername] = useState("Anonymous");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('join response', (data) => {
      /* uncomment if using npm run dev
        navigate("/TestGame");
      */
      if(data.success){
        navigate("/TestGame");
      } else {
        setError("Room code is required.");
      }
    })
  },[])

  function updateUsername(event){
    setUsername(event.target.value);
  }

  function updateRoomCode(event){
    setRoomCode(event.target.value);
  }

  function clickPlay(){
    //Handle Username
    socket.emit('username change',{data:username});
    //Handle joining room with room code
    socket.emit('join attempt', {roomcode: roomCode});
  }

  /*return (
    <div >
      <h1>Test Join Page</h1>
      <input onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
      <input onChange = {updateJoinCode} type="text" placeholder="Room Code"></input>
      <button onClick={joinGame}>Join</button>
      <h2>{serverAns}</h2>
    </div>
  );*/
  return (
    <div className="join-modal">
      <div onClick={onClose} className="join-overlay"></div> {/* Popup closes if clicked outside of it */}
      <div className="join-modal-content">
      <h2 className = "join-title">Join Room</h2>
      <input className="join-input" onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
        <input className="join-input" onChange = {updateRoomCode} type="text" placeholder="Enter Room Code"></input>
        {error && <p className="join-error-message">{error}</p>} {/* Show error if room code is not entered */}
        <button className="join-button-play" onClick={clickPlay}>Play</button>
        <button className="join-close-modal" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}

export default JoinModal;