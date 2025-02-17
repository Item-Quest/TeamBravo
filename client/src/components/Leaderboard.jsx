import React, { useEffect, useState, useRef } from 'react';
import { useNavigate} from 'react-router-dom';

const Leaderboard = (props) => {

    const navigate = useNavigate();

    const BackClick = () => {
        navigate("/home");
    }


    return (
        <div className='leaderboard'>
            <div className='leaderboard-title'>Leaderboard</div>
            <div className='leaderboard-players-container'>
            {
                props.players.sort(x=>x.Score).map((player, index) =>
                    <div className='leaderboard-player-container' key={player.Id}>
                        <span className='leaderboard-place'>{index + 1}</span>
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

