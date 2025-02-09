import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from './Camera';

const PlayCreate = props => {
    
    const navigate = useNavigate();

    const playClick = () => {
        navigate("/play");
    }

    const createClick = () => {
        alert("Create was clicked");
    }
    return (
        <div className='PlayCreate'>
            <div className='PlayCreate-buttons-panel'>
                <button className='playClick-menu-button' onClick={playClick}>Play</button>
                <button className='playClick-menu-button' onClick={createClick}>Create</button>
            </div>
        </div>
    )
}

export default PlayCreate