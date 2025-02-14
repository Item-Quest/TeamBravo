import React, { useEffect, useState, useRef } from 'react';
import { useNavigate} from 'react-router-dom';
import {getLeaderboardData} from '../dataProvider.js';

const Leaderboard = () => {

    const navigate = useNavigate();

    const [leaderboardData, setLeaderboardData] = useState([]);

    const BackClick = () => {
        navigate("/home");
    }

    useEffect(() => {
        setLeaderboardData(getLeaderboardData());
    }, []);

    return (
        <div className='leaderboard'>
            <div className='leaderboard-title'>Leaderboard</div>
            <div className='leaderboard-players-container'>
            {
                leaderboardData.map(player =>
                    <div className='leaderboard-player-container' key={player.Place}>
                        <span className='leaderboard-place'>{player.Place}</span>
                        <img className='leaderboard-pfp' src={player.Pfp} alt="Player Profile" />
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

