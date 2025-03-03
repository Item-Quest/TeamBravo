import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from 'react-router-dom';
import socket from '../socket';
import {connectGame} from '../dataProvider.js';

//importing my own css styling because game page is broken
import './PlayScreen.css'
import logo from '../assets/logo.png'

const PlayScreen = (props) => {
  console.log(props.gameState, "Gamestate");
  const [usersInRoom, updateUsersInRoom] = useState([]);
  const [time, updateTime] = useState(0);
  const [item, updateItem] = useState([])
  const [input, updateInput] = useState("");
  const [yourScore, setYourScore] = useState(0);
  const intervalRef = useRef(null);

  const [showPopUp, updatePopUp] = useState(false);
  const [winner, updateWinner] = useState("");
  const [winnerTime, updateWinnerTime] = useState("");

  useEffect(() => {
    connectGame((data) => {
      console.log("data received", data);
      console.log(socket.id);
      // Extract current item
      if(data.items){
        updateItem(data.items);
        console.log(data.items)
        //Grab client's score for the purposes of only displaying item associated with score
      }
      // Extract game state
      if(data.game_state){
        props.updateGameState(data.game_state);
        if(props.gameState === "waiting"){
          if(props.AIOutput != ""){
            props.updateAIOutput("");
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
      //set player score
      setYourScore(users[socket.id].score);
    });

    socket.on('start game', () => {
      updateTime(0);
      updatePopUp(false);
    })

    socket.on('winner', (data) => {
      updatePopUp(true);
      updateWinner(data.message);
      updateWinnerTime(data.time);
    });

    return () => {
      socket.emit('leave game');
    }
  },[])


  //use effect hook for incrementing time
  useEffect(() => {
    let interval;
    if(props.gameState === "running"){
      intervalRef.current = setInterval(() => {
        updateTime((prev) => prev+1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [props.gameState])

  useEffect(() => {
    if (props.AIOutput && props.AIOutput === item[yourScore % item.length]) {
      submit();
    }
  }, [props.AIOutput]);  // Dependency on AIOutput

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
    } else if(props.AIOutput === item[yourScore%item.length]){
      socket.emit('submit', {submit:props.AIOutput});
    }
    updateInput("");
  }

  return(
    <div className = "gameContainer">
      <div className = "gameBar">
        <img src={logo} alt="Logo"/>
        {props.gameState==="waiting" && (<div className="gameX"><h2>Time</h2><span>Game Hasn't started</span></div>)}
        {props.gameState==="running" && (<div className="gameX"><h2>Time</h2><span>{time}</span></div>)}  
        {props.gameState==="waiting" && (<div className="gameX"><h2>Item</h2><span>None</span></div>)}
        {
          props.gameState==="running" && (
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
          {props.gameState==="waiting" && (<button onClick={startGame}>Start Game</button>)}
          {props.gameState==="running" && (<button onClick={endGame}>End Game</button>)}   
        </div>

        <div className="gameCamera">
          {props.camera}
          {/*<PlayCamera getAIOutput={getAIOutput} gameState={gameState}/>*/}
        </div>
        
        <div className="gamePanel">
          <div class="gameX">
            <h2>Room Code</h2>
            <span>{props.game.roomCode}</span>
            <div>Detected Item: {props.AIOutput}</div>
          </div>
          <div class ="gameX">
            {showPopUp && (<div>{winner} wins with a time of {winnerTime} seconds</div>)}
            <input onChange={changeInput} value={input} type="text" placeholder="Enter Item"></input>
            <button onClick={submit}>Submit</button>
          </div>   
        </div>
      </div>
    </div>
  );

  
}


export default PlayScreen;