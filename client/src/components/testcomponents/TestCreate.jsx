import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import socket from '../../socket';

const TestCreate = () => {
  const [username, setUsername] = useState("Anonymous");
  const [joinCode, setJoinCode] = useState("");
  const [serverAns, setServerAns] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('game created', () => {
      navigate("/TestGame")
    })
  },[])

  function updateUsername(event){
    setUsername(event.target.value);
  }

  function createGame(){
    //Handle Username
    socket.emit('username change',{data:username});
    //Handle joining room with room code
    socket.emit('create game');
  }

  return (
    <div >
      <h1>Test Create Page</h1>
      <input onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
      <button onClick={createGame}>Create Game</button>
      <h2>{serverAns}</h2>
    </div>
  );
}

export default TestCreate;