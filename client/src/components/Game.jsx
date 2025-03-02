import React, {useState, useMemo} from "react";
import PlayCamera from './PlayCamera.jsx';
import PlayScreen from './PlayScreen.jsx';


const Game = (props) => {
  const [gameState, updateGameState] = useState("waiting");
  const [AIOutput, updateAIOutput] = useState("");
  //callback function that is passed as a prop
  function getAIOutput(label){
    console.log("ai output:", label);
    //set aioutput
    updateAIOutput(label);
  }

  console.log("Game.jsx loaded");

  const camera = useMemo(() => {
    return <PlayCamera getAIOutput={getAIOutput} gameState={gameState} />;
  }, [gameState]);

  return(
    <div>
      <PlayScreen 
        updateGameState={updateGameState}
        AIOutput={AIOutput}
        updateAIOutput={updateAIOutput} 
        game={props.game} 
        camera={camera}
        getAIOutput={getAIOutput} 
        gameState = {gameState}
      />
    </div>
  );

  
}


export default Game;