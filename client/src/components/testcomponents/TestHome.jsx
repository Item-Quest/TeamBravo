import React from "react";
import { useNavigate} from 'react-router-dom';

const TestHome = () =>{

  const navigate = useNavigate();

  function JoinClick(){
    navigate("/TestJoin");
  }

  function CreateClick(){
    navigate("/TestCreate");
  }

  function LeaderBoardClick(){
    navigate("/TestLeaderboard");
  }

  return(
    <div>
      <h1>Test Home Screen</h1>
      <button onClick={JoinClick}>Join</button>
      <button onClick={CreateClick}>Create</button>
      <button onClick={LeaderBoardClick}>Leaderboard</button>
    </div>
  );
}

export default TestHome;