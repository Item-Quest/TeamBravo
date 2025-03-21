import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPlayers, getTopScores } from '../dataProvider.js';

const Leaderboard = (props) => {
    const navigate = useNavigate();
    const [leaderPlayers, setLeaderPlayers] = useState([]);
    const [mode, setMode] = useState(-1);

    const backClick = () => {
        navigate("/home");
    }

    const fetchTopScores = async () => {
        console.log("fetching top scores");
        getTopScores(mode, (topScores) => {
            console.log("top scores fetched");
            setLeaderPlayers(topScores);
        });
    };

    useEffect(() => {
        fetchTopScores();
    }, []);

    return (
        <div className='leaderboard'>
            <div className='leaderboard-title'>Leaderboard</div>
            <div className='leaderboard-buttons'>
                <button
                    onClick={() => setMode(-1)}
                    style={{ backgroundColor: mode === -1 ? 'darkgrey' : 'white' }}
                >
                    All Modes
                </button>
                <button
                    onClick={() => setMode(0)}
                    style={{ backgroundColor: mode === 0 ? 'darkgrey' : 'white' }}
                >
                    Classic Mode
                </button>
            </div>
            <div className='leaderboard-players-container'>
                {
                    leaderPlayers.sort((a, b) => b[1] - a[1]).map((player, index) =>
                        <div className='leaderboard-player-container' key={player.Id}>
                            <span className='leaderboard-place'>{index + 1}</span>
                            <span className='leaderboard-name'>{player[0]}</span>
                            <span className='leaderboard-score'>{'score: ' + player[1]}</span>
                            <span className='leaderboard-gamemode'>{'mode: ' + player[2]}</span>
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

