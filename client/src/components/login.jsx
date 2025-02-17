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

    navigate("/Test");
  }

  function doAlert(message){
    alert(message);
  }

  return (
    <div className='login-background'>
      <div className='login-container'>
        <input onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
        <button className="login-button-play" onClick={playGame}>Play</button>
      </div>
    </div>
  );
}


export default Login;