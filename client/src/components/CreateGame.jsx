import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {createGame} from '../dataProvider.js';
import click from '../assets/SFX/click.wav';
import backclick from '../assets/SFX/backclick.wav';

const CreateGame  = (props) => {
    const usernameRef = useRef(null);
    const navigate = useNavigate();
      const clickSound = new Audio(click);
      const backClickSound = new Audio(backclick);

    const backClick = () => {
        backClickSound.play();
        navigate("/home");
    }

    const playClick = () => {
        var uName = usernameRef.current.value;
        var newGame = createGame(uName, (result) => {
            props.updateGame(uName, result.roomCode, result.sid);
        });
        clickSound.play();
        navigate("/play");
    }


    return (
        <div className='create-game'>
            <div className='create-container'>
                <div className='create-title'>Create Game</div>
                <div className='create-settings'>
                    <div name='username'>
                        <input type="text" name="username" placeholder="Enter Username" ref={usernameRef}></input>
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