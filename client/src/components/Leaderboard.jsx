import React, { useEffect, useState, useRef } from 'react';
import { useNavigate} from 'react-router-dom';
import {getAllPlayers} from '../dataProvider.js';

const Leaderboard = (props) => {

    const navigate = useNavigate();
    const [leaderPlayers, setLeaderPlayers] = useState([]);
    
    const BackClick = () => {
        navigate("/home");
    }

  useEffect(async () => {
    getAllPlayers((allPlayers) => {
        debugger;
        setLeaderPlayers(allPlayers);
    });
  }, []);

    return (
        <div className='leaderboard'>
            <div className='leaderboard-title'>Leaderboard</div>
            <div className='leaderboard-players-container'>
            {
                leaderPlayers.sort(x=>x.Score).map((player, index) =>
                    <div className='leaderboard-player-container' key={player.Id}>
                        <span className='leaderboard-place'>{index + 1}</span>
                        <span className='leaderboard-name'>{player.Name}</span>
                        <span className='leaderboard-score'>{'score: ' + player.Score}</span>
                    </div>
                )
            }
            </div>
            <div className='back-button-container'>
                <button className='back-button' onClick={BackClick}>Back</button>
            </div>
        </div>
    )
}

export default Leaderboard;

