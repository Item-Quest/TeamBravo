import React, {useState} from "react";
import { useNavigate} from 'react-router-dom';
import Camera from '../Camera';
import JoinModal from './TestJoinRoom' /* For Join Room Popup/Modal */
import logo from '../../assets/logo.png';


const TestHome = () =>{

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); /* Set Join Room Popup/Modal to closed/false */
    

    function JoinClick(){
        setIsModalOpen(true);
    }

    function CreateGameClick(){
        navigate("/TestCreateGame");
    }

    function LeaderboardClick(){
        navigate("/TestLeaderboard");
    }

    const SettingsClick = () => {
        navigate("/MenuSettings");
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
                    <span>How To play </span>
                    <text>How To play </text>
                </div>
            </div>
        </div>
        <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> {/* Join Screen Popup/Modal */}
    </div>
  )
}

export default TestHome;