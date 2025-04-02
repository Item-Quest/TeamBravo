import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import socket from '../../socket';

const TestCreateGame  = () => {
  const [username, setUsername] = useState("Anonymous");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('game created', () => {
      navigate("/TestGame")
    })
  },[])

  const backClick = () => {
    navigate("/home");
  }

  function updateUsername(event){
    setUsername(event.target.value);
  }

  const playClick = () => {
    //comment out when running on server
    //navigate("/TestGame")
    //Handle Username
    socket.emit('username change',{data:username});
    //Handle joining room with room code
    socket.emit('create game');
  }


  return (
    <div className='create-game'>
      <div className='create-container'>
        <div className='create-title'>Create Game</div>
        <div className='create-settings'>
          <div name='username'>
            <label name="username">Username:</label>
            <input onChange = {updateUsername} type="text" name="username"></input>
          </div>
          <div className="create-other-settings"></div>
        </div>
      </div>
      <div className='create-button-container'>
        <button className='back-button' onClick={backClick}>Back</button>
        <button className='play-button' onClick={playClick}>Play</button>
      </div>
    </div>
  );
}

/*const TestCreateGame = () => {
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
    //comment out when running on server
    //navigate("/TestGame")
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
}*/

export default TestCreateGame;
