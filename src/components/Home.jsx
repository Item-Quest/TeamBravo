import React, { useEffect, useState, useRef } from 'react';

const Home = props => {
    
    const playClick = () => {
        alert("Play was clicked");
    }

    const LeaderboardClick = () => {
        alert("Leaderboard was clicked");
    }


    return (
        <div className='home'>
            <div className='home-buttons-panel'>
                <button className='home-menu-button' onClick={playClick}>Play</button>
                <button className='home-menu-button' onClick={LeaderboardClick}>Leaderboard</button>
                <div className='home-item'>Item</div>
            </div>
            <div className='home-camera-panel'>
                <div className='home-camera'>Camera</div>
            </div>
        </div>
    )
}


export default Home