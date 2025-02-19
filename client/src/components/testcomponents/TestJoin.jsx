import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import socket from '../../socket';

const TestJoin = () =>{
  const [username, setUsername] = useState("Anonymous");
  const [joinCode, setJoinCode] = useState("");
  const [serverAns, setServerAns] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('join response', (data) => {
      if(data.success){
        navigate("/TestGame");
      } else {
        setServerAns("Invalid Room Code: Please try again");
      }
    })
  },[])

  function updateUsername(event){
    setUsername(event.target.value);
  }

  function updateJoinCode(event){
    setJoinCode(event.target.value);
  }

  function joinGame(){
    //Handle Username
    socket.emit('username change',{data:username});
    //Handle joining room with room code
    socket.emit('join attempt', {roomcode: joinCode});
  }

  return (
    <div >
      <h1>Test Join Page</h1>
      <input onChange = {updateUsername} type="text" placeholder="Enter Username"></input>
      <input onChange = {updateJoinCode} type="text" placeholder="Room Code"></input>
      <button onClick={joinGame}>Join</button>
      <h2>{serverAns}</h2>
    </div>
  );
}

export default TestJoin;