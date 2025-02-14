import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from './Camera';
import logo from '../assets/logo.png'

const Home = props => {
    
    const navigate = useNavigate();

    const JoinClick = () => {
        alert("Play was clicked");
    }

    const CreateGameClick = () => {
        {navigate("/play");}
    }

    const LeaderboardClick = () => {
        navigate("/leaderboard");
    }

    const SettingsClick = () => {
        alert("settings Goes Here")
        {navigate("/");}
    }

    const BackEndClick = () => {
        navigate("/TestLogin")
    }
    

    return (
        <div className='home'>
        <div className='home-content'> {/* Container for content */}
            <div className='home-left-panel'> {/* Left Panel for buttons */}
                <div className='home-left-panel-upper'>
                    <img src={logo} alt="Logo" className='logo-container' />
                </div>
                <div className='home-left-panel-middle'>
                    <div className='home-menu-panel'>
                            <button className='home-menu-button' onClick={JoinClick}>JOIN GAME</button>
                            <button className='home-menu-button' onClick={CreateGameClick}>Create Game</button>
                            <button className='home-menu-button' onClick={LeaderboardClick}>Leader Board</button>
                    </div>
                </div>
                <div className='home-left-panel-lower'>
                    <div className='settings-button-container'>
                        <button className='settings-button' onClick={SettingsClick}>Settings</button>
                        <button className='settings-button' onClick={BackEndClick}>Backend</button>
                    </div>
                </div>
                
            </div>

            <div className='home-right-panel'> {/* Right Panel for Camera */}
                <div className='home-panel-title'>
                    Test Your Camera
                </div> {/* Title */}
                <div className='home-camera-panel'> {/* Container for Camera */}
                    <Camera />
                </div>
                <div className='home-right-panel-lower'>
                    <text>How To play </text>
                </div>
            </div>
        </div>
        </div>
    )
}


export default Home;