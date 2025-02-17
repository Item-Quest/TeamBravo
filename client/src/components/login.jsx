import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import '../styles/login.css'
import socket from '../socket';
function Login(){

  const [username, setUsername] = useState("Anonymous");
  const navigate = useNavigate();

  function updateUsername(event){
    setUsername(event.target.value);
  }

  function playGame(){
    socket.emit('username change', {data: username});

<<<<<<< HEAD
    navigate("/Home");
  }

  function LeaderBoardClick(){
    navigate("/leaderboard");
  }

  function joinRoomClick(){
    navigate("/Room");
=======
    navigate("/Test");
>>>>>>> Dannny
  }

  function doAlert(message){
    alert(message);
  }

  return (
    <div className='login-background'>
<<<<<<< HEAD
      <div className='login-logo'><span className='login-item1-logo'>Insert_</span><span className='login-item2-logo'>Logo_Here_<FontAwesomeIcon icon={faCamera} /></span></div>
      <div className='login-container'>
        <input onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
        <button className="login-button-play" onClick={playGame}>Play</button>
        <button className="login-button-generic" onClick={joinRoomClick}>Join Room</button>
        <button className="login-button-generic" onClick={() => doAlert('Create Room has been clicked')}>Create Room</button>
        <button className="login-button-generic" onClick={LeaderBoardClick}>Leaderboard</button>
      </div>
      <footer className='login-footer'> 
        <div className='footer-box-item'>
          <h2>How to play</h2>
          <p>Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        
        <span>Made by Team Bravo</span>
      </footer>
=======
      <div className='login-container'>
        <input onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
        <button className="login-button-play" onClick={playGame}>Play</button>
      </div>
>>>>>>> Dannny
    </div>
  );
}


export default Login;