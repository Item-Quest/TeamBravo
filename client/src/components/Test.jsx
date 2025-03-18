import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from './Camera';
import socket from '../socket';

const Home = props => {
    const [usersInRoom, updateUsersInRoom] = useState([]);
    const [currItem, updateCurrItem] = useState("");
    const [inputItem, setInputItem] = useState("");
    const [serverAns, setServerAns] = useState("");

    const [time, setTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [finalTime, setFinalTime] = useState(null);
    const timerRef = useRef(null);
    const timeRef = useRef(0);

    const [showPopup, setShowPopup] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    
    
    useEffect(() => {
        socket.emit('connect game')



        socket.on('room data', (data) => {
            console.log(data);
            const formattedUsers = data.map(([id, username, score]) => ({ id, username, score }));
            updateUsersInRoom(formattedUsers);
            console.log(usersInRoom);
        })

        socket.on('item data', (data) => {
            updateCurrItem(data);
        })

        socket.on('items complete', () => {
            socket.emit('end request');
            setFinalTime(timeRef.current);
            setGameStarted(false);
            setShowPopup(true);
        })

        socket.on('server input res', (data) => {
            //setServerAns(data.response);
        })

        return () => {
            socket.emit('leave game')
        }

    },[])

    const navigate = useNavigate();

    const HandleInput = (event) => {
        setInputItem(event.target.value);
    }

    const HandleSubmit = () => {
        if(inputItem === currItem){
            //Send answer to server to check
            socket.emit('check input', inputItem);
        } else {
            setServerAns("False");
        }

        setInputItem("");
    }

    const Login = () => {
        navigate("/login")
    }

    const startGame = () => {
        setGameStarted(true);
        setFinalTime(null);
        setFinalScore(0);
        setTime(0);
        setShowPopup(false);
        socket.emit('start request');
    }

    const startTimer = () => {
        setGameStarted(true);
        setFinalTime(null);
        setTime(0);
        socket.emit('start_timer');
        console.log('starting timer');
    }

    //timer function
    useEffect(() => {
        if (gameStarted) {
            timerRef.current = setTimeout(() => {
                setTime(time + 1);
            }, 1000);
        } else if (time === 0 && timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [time, gameStarted]);

    //final time setter
    useEffect(() => {
        timeRef.current = time;  // Keep track of the latest time
    }, [time]);

    return (
        <div className='home'>
            <div className='home-buttons-panel'>
                <div className='home-item'>Item</div>
                <button className='home-menu-button' >
                    {finalTime !== null ? `Final time: ${finalTime}` : (time > 0 ? time : "Timer")}
                </button>
                <button 
                    className='home-menu-button' 
                    onClick={() => {startTimer(); socket.emit('start request');}}
                >
                    Start Game
                </button>
                <button 
                    className='home-menu-button' 
                    onClick={() => {socket.emit('end request'); setFinalTime(time); setGameStarted(false); setShowPopup(true);}}
                >
                    End Game
                </button>
            </div>
    
            <div>
                <h1>Connected Players:</h1>
                <ul>
                    {usersInRoom.map((user, index) => (
                        <li key={index}>User: {user.username} Items Complete: {user.score}</li>
                    ))}
                </ul>
    
                <h2>Item: {currItem}</h2>
                <input onChange={HandleInput} value={inputItem} type="text" placeholder="Enter Item"></input>
                <button onClick={HandleSubmit}>Submit</button>
                <h2>Server Response: {serverAns}</h2>
            </div>
    
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Game Over!</h2>
                        <p>Final Time: {finalTime} seconds</p>
                        <p>Final Score: {finalScore}</p>
                        <button onClick={() => { setShowPopup(false); startGame(); }}>
                            Start New Game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Home