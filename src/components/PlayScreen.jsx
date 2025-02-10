import React, { useState, useEffect } from "react";
import Camera from './Camera';

const PlayScreen = () => {
    const [time, setTime] = useState(90);
    const [skips, setSkips] = useState(3);
    const [resetTime, setResetTime] = useState(30);
    const [isResetTimerActive, setIsResetTimerActive] = useState(false);

    useEffect(() => {
        if (time > 0) {
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [time]);

    useEffect(() => {
        if (isResetTimerActive && resetTime > 0) {
            const resetTimer = setInterval(() => {
                setResetTime((prevResetTime) => prevResetTime - 1);
            }, 1000);
            return () => clearInterval(resetTimer);
        } else if (resetTime === 0) {
            setSkips(3);
            setIsResetTimerActive(false);
            setResetTime(30);
        }
    }, [resetTime, isResetTimerActive]);

    const handleSkip = () => {
        if (skips > 0) {
            setSkips((prevSkips) => prevSkips - 1);
            if (!isResetTimerActive) {
                setIsResetTimerActive(true);
            }
        }
    };

    const resetMinutes = Math.floor(resetTime / 60);
    const resetSeconds = resetTime % 60;
    const formattedResetTime = `${resetMinutes}:${resetSeconds < 10 ? `0${resetSeconds}` : resetSeconds}`;

    return (
        <div className="play-screen">
            <div className="top-section">
                <div className="top-box">Logo</div>
                <div className="top-box">Item</div>
                <div className="top-box timer">
                    <span className="timer-label">Timer</span>
                    <span className="timer-count">
                        {time > 0 ? `${Math.floor(time / 60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60}` : "Time's Up!"}
                    </span>
                </div>
            </div>

            <div className="main-section">
                <div className="camera-box">
                    <Camera />
                </div>
                <div className="score-section">
                    <div className="score-box">Your Score</div>
                    <div className="score-box">Opponent Score</div>
                    <button className="skip-button" onClick={handleSkip}>Skip</button>
                    <div className="skip-count">Skips Left: {skips}</div>

                    <div className="reset-timer">
                        <div className="reset-timer-label">Recharge</div>
                        <div className="reset-timer-count">{formattedResetTime}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayScreen;



