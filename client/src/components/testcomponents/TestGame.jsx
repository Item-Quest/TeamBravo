import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import socket from '../../socket';
import TestCamera from './TestCamera.jsx';

//importing my own css styling because game page is broken
import './TestGame.css'
import logo from '../../assets/logo.png'

const TestGame = () => {
  const [usersInRoom, updateUsersInRoom] = useState([]);
  const [roomCode, updateRoomCode] = useState("");
  const [time, updateTime] = useState("0");
  const [gameState, updateGameState] = useState("waiting");
  const [item, updateItem] = useState([]);
  const [input, updateInput] = useState("");
  const [AIOutput, updateAIOutput] = useState("");
  const [socketId, setSocketId] = useState("");
  const [yourScore, setYourScore] = useState(0);

  const [showPopUp, updatePopUp] = useState(false);
  const [winner, updateWinner] = useState("");

  useEffect(() => {
    socket.emit('connect game');

    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    socket.on('room data', (data) => {
      console.log(data)
      // Extract current item
      if(data.items){
        updateItem(data.items);
        console.log(data.items)
        //Grab client's score for the purposes of only displaying item associated with score
      }
      // Extract time for room
      if(data.time){
        updateTime(data.time);
      }
      // Extract room code Data
      if(data.room_code){
        updateRoomCode(data.room_code);
      }
      // Extract game state
      if(data.game_state){
        updateGameState(data.game_state);
        if(gameState === "waiting"){
          if(AIOutput != ""){
            updateAIOutput("");
          }
        }
      }
      //Extract user data
      const users = {}
      Object.entries(data).forEach(([key,value]) => {
        if(key.startsWith("user:")) {
          const [, socketID, field] = key.split(":");
          if(!users[socketID]){
            users[socketID] = {};
          }
          users[socketID][field] = value;
        }
      })

      //convert user data to array
      const usersArray = Object.values(users);
      updateUsersInRoom(usersArray);

      console.log(users);
      if (users[socketId] && users[socketId].score !== undefined) {
        setYourScore(users[socketId].score);
      }

    });

    socket.on('start game', () => {
      updatePopUp(false);
    })

    socket.on('winner', (data) => {
      updatePopUp(true);
      updateWinner(data.message)
    });

    return () => {
      socket.emit('leave game');
    }
  },[])

  function startGame(){
    socket.emit('start game');
  }

  function endGame(){
    socket.emit('end game');
  }

  function changeInput(event){
    updateInput(event.target.value);
  }

  function submit(){
    console.log("submit attempt: ", input, " ", item[yourScore%item.length]);
    if(input === item[yourScore%item.length]){
      socket.emit('submit', {submit:input});
    }
    updateInput("");
  }

  //callback function that is passed as a prop
  function getAIOutput(label){
    //console.log("ai output: ", label)
    updateAIOutput(label)
  }

  return(
    <div className = "gameContainer">
      <div className = "gameBar">
        <img src={logo} alt="Logo"/>
        {gameState==="waiting" && (<div className="gameX"><h2>Time</h2><span>Game Hasn't started</span></div>)}
        {gameState==="running" && (<div className="gameX"><h2>Time</h2><span>{time}</span></div>)}  
        {gameState==="waiting" && (<div className="gameX"><h2>Item</h2><span>None</span></div>)}
        {
          gameState==="running" && (
            <div className="gameX">
              <h2>Item</h2>
              <span>{item[yourScore%item.length]}</span>
            </div>
          )
        }  
      </div>
      <div className="gameSection">
        <div className="gamePanel">
          <div class = "gameX">
            <h2 class="gameX">Connected Players</h2>
            <ul>
              {usersInRoom.map((user, index) => (
                  <li class="gameX" key={index}>
                    <h3>{user.username}</h3>
                    <span>{user.score} points</span>
                  </li>
              ))}
            </ul>
          </div>
          {gameState==="waiting" && (<button onClick={startGame}>Start Game</button>)}
          {gameState==="running" && (<button onClick={endGame}>End Game</button>)}   
        </div>

        <div className="gameCamera">
          <TestCamera getAIOutput={getAIOutput} gameState={gameState}/>
        </div>
        
        <div className="gamePanel">
          <div class="gameX">
            <h2>Room Code</h2>
            <span>{roomCode}</span>
            <div>Detected Item: {AIOutput}</div>
          </div>   
          <input onChange={changeInput} value={input} type="text" placeholder="Enter Item"></input>
          <button onClick={submit}>Submit</button>
          {/*<button onClick={submit}>Submit</button>*/}
          {showPopUp && (<div>{winner} wins!</div>)}
        </div>
      </div>
    </div>
  );

  
}


export default TestGame;