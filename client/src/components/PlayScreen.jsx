import { useState, useEffect } from "react";
import Camera from './Camera';
import { Grid, Button, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import logo from '../assets/logo2.png';

const PlayScreen = () => {
    const [time, setTime] = useState(90);
    const [skips, setSkips] = useState(3);
    const [resetTime, setResetTime] = useState(30);
    const [isResetTimerActive, setIsResetTimerActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

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
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{ width: '200px', cursor: 'pointer' }}
                                onClick={() => {
                                    console.log("Logo clicked!");
                                    setIsMenuOpen(true);
                                }}
                                onLoad={(e) => {
                                    console.log("Logo container dimensions:", e.target.parentElement.offsetWidth, 'x', e.target.parentElement.offsetHeight);
                                  }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            
                        </Grid>
                        <Grid item xs={4}>
                            
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Camera />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Timer</Typography>
                                    <Typography variant="h6">
                                        {time > 0 ? `${Math.floor(time / 60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60}` : "Time's Up!"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Your Score</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Opponent Score</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={handleSkip}>Skip</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    {Array.from({ length: skips }, (_, i) => <SkipNextIcon key={i} />)}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Recharge</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{formattedResetTime}</Typography>
                                    {console.log("Current time:", time)}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={isMenuOpen} onClose={handleMenuClose}>
                <DialogTitle>Quit Game?</DialogTitle>
                <DialogContent>
                    Are you sure you want to quit?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleMenuClose}>Cancel</Button>
                    <Button onClick={() => { /* Handle quit logic here */ }}>Quit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PlayScreen;



