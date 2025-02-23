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
        createGame(uName, (sid) => {
            props.updateGame(uName, null, sid);
            navigate("/play");
        });
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