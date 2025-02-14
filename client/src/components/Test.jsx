import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Camera from './Camera';
import socket from '../socket';

const Home = props => {
    const [usersInRoom, updateUsersInRoom] = useState([]);
    const [currItem, updateCurrItem] = useState("");
    const [inputItem, setInputItem] = useState("");
    const [serverAns, setServerAns] = useState("");

    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    
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

    socket.on('timer_started', () => {
        setTimeLeft(10);
        console.log('timer started');
    });

    const startTimer = () => {
        socket.emit('start_timer');
        console.log('starting timer');

    }

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        return () => { clearTimeout(timerRef.current); }
    }, [timeLeft]);

    return (
        <div className='home'>
            <div className='home-buttons-panel'>
                <div className='home-item'>Item</div>
                <button className='home-menu-button' onClick={startTimer}>
                    {(timeLeft > 0) ? timeLeft : "Start Timer"}
                </button>
            </div>
            <div>
                <h1>Connected Players:</h1>
                <ul>
                    {usersInRoom.map((user, index) => (
                        <li key={index}>User:{user.username} Score:{user.score}</li>
                    ))}
                </ul>

                <h2>Item: {currItem}</h2>
                <input onChange={HandleInput} value={inputItem} type="text" placeholder="Enter Item"></input>
                <button onClick={HandleSubmit}>Submit</button>
                <h2>Server Response: {serverAns}</h2>
            </div>
        </div>
    )
}


export default Home