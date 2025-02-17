import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {createGame} from '../dataProvider.js';

const CreateGame  = (props) => {
    const usernameRef = useRef(null);
    const navigate = useNavigate();

    const backClick = () => {
        navigate("/home");
    }

    const playClick = () => {
        var uName = usernameRef.current.value;
        var newGame = createGame(uName);
        var g = {...props.game};
        g.gameCode = newGame.gameCode;
        g.allPlayers.push(newGame.gameOwner);
        g.gameOwnerIdx = g.allPlayers.length - 1;
        props.setGame(g);
        navigate("/play");
    }


    return (
    <div className='create-game'>
        <div className='create-container'>
            <div className='create-title'>Create Game</div>
            <div className='create-settings'>
                <div name='username'>
                    <label name="username">Username:</label>
                    <input type="text" name="username" ref={usernameRef}></input>
                </div>
                <div className="create-other-settings"></div>
            </div>
        </div>
        <div className='create-button-container'>
            <button className='back-button' onClick={backClick}>Back</button>
            <button className='play-button' onClick={playClick}>Play</button>
        </div>
    </div>
    )
}

export default CreateGame;