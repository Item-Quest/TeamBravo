import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPlayers, getTopScores } from '../dataProvider.js';

const Leaderboard = (props) => {
    const navigate = useNavigate();
    const [leaderPlayers, setLeaderPlayers] = useState([]);

    const backClick = () => {
        navigate("/home");
    }

    useEffect(() => {
        // getAllPlayers((allPlayers) => {
        //     setLeaderPlayers(allPlayers);
        // });
        //not sure what the above section does so i commented it out for now.
        const fetchTopScores = async () => {
            console.log("fetching top scores");
            getTopScores(-1, (topScores) => {
                setLeaderPlayers(topScores);
            });
        };

        fetchTopScores();
    }, []);

    return (
        <div className='leaderboard'>
            <div className='leaderboard-title'>Leaderboard</div>
            <div className='leaderboard-players-container'>
                {
                    leaderPlayers.sort((a, b) => b.Score - a.Score).map((player, index) =>
                        <div className='leaderboard-player-container' key={player.Id}>
                            <span className='leaderboard-place'>{index + 1}</span>
                            <span className='leaderboard-name'>{player.Name}</span>
                            <span className='leaderboard-score'>{'score: ' + player.Score}</span>
                        </div>
                    )
                }
            </div>
            <div className='back-button-container'>
                <button className='back-button' onClick={backClick}>Back</button>
            </div>
        </div>
    )
}

export default Leaderboard;

