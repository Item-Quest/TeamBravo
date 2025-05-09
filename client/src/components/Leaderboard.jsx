import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import socket from '../socket';
import { getUserinfo } from '../dataProvider';
import click from "../assets/SFX/click.wav"
import backClick from "../assets/SFX/backclick.wav"


// Material-UI imports
import {
    Container,
    Grid,
    Typography,
    Paper,
    Button,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Chip,
    CircularProgress
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';

// Import logo
import logo from '../assets/logo2.png';

const Leaderboard = (props) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [timeFrame, setTimeFrame] = useState('all');
    const [gameMode, setGameMode] = useState('Item Race');
    const [loading, setLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [userScores, setUserScores] = useState([]);
    const [uiVolume] = useState(() => {
      const storedVolume = localStorage.getItem('uiVolume');
      return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
    });
    
      const clickSound = new Audio(click);
      clickSound.volume = uiVolume
      const backClickSound = new Audio(backClick);
      backClickSound.volume = uiVolume
      

    // Fetch leaderboard data using socket
    useEffect(() => {
        // Set up socket event listener for leaderboard data
        const handleLeaderboardData = (data) => {
            setLeaderboardData(data);
            setLoading(false);
            setError(null);
            console.log('Leaderboard data received:', data);
        };

        // Add event listener
        socket.on('leaderboard data', handleLeaderboardData);


        // Request leaderboard data
        setLoading(true);
        socket.emit('get leaderboard', { timeFrame, gameMode });

        // Clean up event listener on unmount
        return () => {
            socket.off('leaderboard data', handleLeaderboardData);
        };
    }, [timeFrame, gameMode]); // Refetch when timeFrame or gameMode changes

    // Fetch user info and scores
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                getUserinfo((userInfo) => {
                    setUsername(userInfo.username);
                    setUserScores(userInfo.scores || []);
                    console.log('User info fetched:', userInfo.username);
                    console.log('User scores fetched:', userInfo.scores || []);
                });
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            }
        };
        fetchUserInfo();
    }, []);

    // Fallback to props.players if no data received after a timeout
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (loading && props.players && props.players.length > 0) {
                setLeaderboardData(props.players);
                setLoading(false);
                setError('Could not fetch real-time leaderboard data. Showing cached data instead.');
            }
        }, 5000); // 5 second timeout

        return () => clearTimeout(timeoutId);
    }, [loading, props.players]);

    const handleBackClick = () => {
        backClickSound.play();
        navigate("/home");
    };

    const findrank = () => {
        const player = leaderboardData.find(player => player.Name === username);
        return player ? leaderboardData.indexOf(player) + 1 : "-";
    };
    const getBestScore =() => { 
        const x = userScores.length > 0 ? Math.max(...userScores.map(scoreList => scoreList[2])) : 0;
        console.log("Best score:", x);
        return x;
    };
    const calcWinRate = () => {
        if (userScores.length === 0) return "N/A";
        const wins = userScores.filter(scoreList => scoreList[5] === 1).length;
        return `${((wins / userScores.length) * 100).toFixed(2)}%`;
    };


    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const getPlayerRank = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}`;
    };

    // Find current user in leaderboard data
    const currentUser = leaderboardData.find(player =>
        socket.id && player.Id === socket.id ||
        player.Id === 'current-user-id'
    );

    // Calculate user's rank
    const userRank = currentUser ?
        leaderboardData.findIndex(player => player.Id === currentUser.Id) + 1 :
        '-';

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                overflowY: 'auto', //hopefully this is ok added because scrolling was not working
                position: 'relative',
                boxSizing: 'border-box',
                maxWidth: '100%'
            }}>
                <Grid container spacing={2} sx={{
                    p: 2,
                    flexGrow: 0,
                    justifyContent: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    width: '100%'
                }}>
                    <Grid item xs={12} sx={{ boxSizing: 'border-box', maxWidth: '100%', padding: { xs: '8px', md: '16px' } }}>
                        <Grid container spacing={2} alignItems="center" sx={{ boxSizing: 'border-box', maxWidth: '100%' }}>
                            <Grid item xs={4}>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ width: '200px', cursor: 'pointer' }}
                                    onClick={() => setIsMenuOpen(true)}
                                />
                            </Grid>
                            <Grid item xs={4} align="center">
                                <Paper sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    border: '2px solid var(--accent-color)'
                                }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                                        Leaderboard
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4} align="right">
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleBackClick}
                                >
                                    Back to Home
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid container spacing={2} sx={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            boxSizing: 'border-box',
                            width: '100%'
                        }}>
                            <Grid item xs={12} md={8}>
                                <Paper sx={{ p: 3, borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <EmojiEventsIcon sx={{ mr: 1 }} color="primary" />
                                            Top Scores
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => setShowFilters(!showFilters)}
                                        >
                                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                                        </Button>
                                    </Box>

                                    {showFilters && (
                                        <Box mb={2}>

                                            <Typography variant="subtitle2" gutterBottom>Filters</Typography>
                                            <Box display="flex" gap={2} flexWrap="wrap">
                                                {/* Time Frame Filter */}
                                                <Box>
                                                    <Typography variant="subtitle2" gutterBottom>Time Frame</Typography>
                                                    <Box display="flex" gap={1}>
                                                        <Chip
                                                            label="All Time"
                                                            color={timeFrame === 'all' ? 'primary' : 'default'}
                                                            onClick={() => {
                                                              clickSound.play();
                                                              setTimeFrame('all');
                                                            }}
                                                            clickable
                                                        />
                                                        <Chip
                                                            label="This Week"
                                                            color={timeFrame === 'week' ? 'primary' : 'default'}
                                                            onClick={() =>{
                                                              clickSound.play();
                                                              setTimeFrame('week');
                                                            }}
                                                            clickable
                                                        />
                                                        <Chip
                                                            label="Today"
                                                            color={timeFrame === 'today' ? 'primary' : 'default'}
                                                            onClick={() =>{
                                                              clickSound.play();
                                                              setTimeFrame('today');
                                                            }}
                                                            clickable
                                                        />
                                                    </Box>
                                                </Box>
                                                <Divider orientation="vertical" flexItem />
                                                {/* Game Mode Filter */}
                                                <Box>
                                                    <Typography variant="subtitle2" gutterBottom>Game Mode</Typography>
                                                    <Box display="flex" gap={1}>
                                                        <Chip
                                                            label="Item Race"
                                                            color={gameMode === 'Item Race' ? 'primary' : 'default'}
                                                            onClick={() =>{
                                                              clickSound.play();
                                                              setGameMode('Item Race');
                                                            }}
                                                            clickable
                                                        />
                                                        <Chip
                                                            label="Item Blitz"
                                                            color={gameMode === 'Item Blitz' ? 'primary' : 'default'}
                                                            onClick={() =>{
                                                              clickSound.play();
                                                              setGameMode('Item Blitz');
                                                            }}
                                                            clickable
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    {loading ? (
                                        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                                            <CircularProgress />
                                        </Box>
                                    ) : error ? (
                                        <Box textAlign="center" py={4}>
                                            <Typography color="error">{error}</Typography>
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 2 }}
                                                onClick={() => {
                                                    setLoading(true);
                                                    socket.emit('get leaderboard', { timeFrame, gameMode });
                                                }}
                                            >
                                                Retry
                                            </Button>
                                        </Box>
                                    ) : (
                                        <List>
                                            {leaderboardData.length === 0 ? (
                                                <Box textAlign="center" py={4}>
                                                    <Typography>No leaderboard data available yet.</Typography>
                                                </Box>
                                            ) : (
                                                leaderboardData
                                                    .filter(player => {
                                                        // Filter by game mode
                                                        const matchesGameMode = player.GameMode === gameMode;

                                                        // Filter by time frame
                                                        const now = new Date();
  
                                                        let matchesTimeFrame = false;
                                                        if (timeFrame === 'all') {
                                                            matchesTimeFrame = true; // Include all time
                                                        } else if (timeFrame === 'week') {
                                                            const playerTime = new Date(player.Time.split(' ')[0]);
                                                            const oneWeekAgo = new Date();
                                                            oneWeekAgo.setDate(now.getDate() - 7);
                                                            matchesTimeFrame = playerTime >= oneWeekAgo && playerTime <= now;
                                                        } else if (timeFrame === 'today') {
                                                            const playerTime = new Date(player.Time);
                                                            matchesTimeFrame =
                                                                playerTime.toDateString() === now.toDateString(); // Same day
                                                        }

                                                        return matchesGameMode && matchesTimeFrame;
                                                    })
                                                    .sort((a, b) => {
                                                        if (gameMode === 'Item Race') {
                                                            // Sort lowest to highest for Item Race
                                                            return a.Score - b.Score;
                                                        }
                                                        // Sort highest to lowest for other game modes
                                                        return b.Score - a.Score;
                                                    })
                                                    .map((player, index) => (
                                                        <React.Fragment key={player.Id}>
                                                            <ListItem
                                                                sx={{
                                                                    backgroundColor: index < 3 ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                                                    borderRadius: '4px',
                                                                    mb: 1
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        minWidth: '40px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        mr: 1,
                                                                        fontSize: index < 3 ? '1.5rem' : '1rem'
                                                                    }}
                                                                >
                                                                    {getPlayerRank(index)}
                                                                </Box>
                                                                <ListItemAvatar>
                                                                    <Avatar
                                                                        src={player.Pfp}
                                                                        alt={player.Name}
                                                                        sx={{
                                                                            width: 50,
                                                                            height: 50,
                                                                            border: index < 3 ? '2px solid gold' : 'none'
                                                                        }}
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                            {player.Name}
                                                                        </Typography>
                                                                    }
                                                                    secondary={`Achieved: ${player.Time}`}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'flex-end'
                                                                    }}
                                                                >
                                                                    <Typography variant="h6" color="primary">
                                                                        {player.Score} {player.GameMode === 'Item Race' ? 'seconds' : 'points'}
                                                                    </Typography>
                                                                    <Typography variant="caption">
                                                                        {player.GameMode}
                                                                    </Typography>
                                                                </Box>
                                                            </ListItem>
                                                            {index < leaderboardData.length - 1 && <Divider variant="inset" component="li" />}
                                                        </React.Fragment>
                                                    ))
                                            )}
                                        </List>
                                    )}
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h5">Your Stats</Typography>
                                        <Typography variant="h6">
                                            {username ? username : 'Not signed in'}
                                        </Typography>
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: 'primary.main',
                                                border: '2px solid',
                                                borderColor: 'primary.light',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => navigate('/profile')}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ p: 2, backgroundColor: 'rgba(25, 118, 210, 0.4)', borderRadius: '4px' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Rank</Typography>
                                                <Typography variant="h6">
                                                    {findrank()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Score</Typography>
                                                <Typography variant="h6">
                                                    {getBestScore() || 0}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Games Played</Typography>
                                                <Typography variant="h6">
                                                    {userScores.length || 0}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Win Rate</Typography>
                                                <Typography variant="h6">
                                                    {calcWinRate()}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>

                                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                                    <Typography variant="h6" gutterBottom>Game History</Typography>
                                    <List dense>
                                        {userScores.length > 0 ? (
                                            userScores.map((score, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={score[4]} // Game mode
                                                        secondary={new Date(score[3]).toLocaleString()} // Date/time played
                                                    />
                                                    <Typography variant="body2">
                                                        {score[2]} {score[1] === 'Item Race' ? 'seconds' : 'points'}
                                                    </Typography>
                                                </ListItem>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No game history available.
                                            </Typography>
                                        )}
                                    </List>
                                    <Button
                                        variant="text"
                                        size="small"
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    >
                                        View All Games
                                    </Button>
                                </Paper>

                                {/* <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>Actions</Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth 
                                        sx={{ mb: 1 }}
                                        onClick={() => navigate('/play')}
                                    >
                                        Play New Game
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="secondary" 
                                        fullWidth
                                        onClick={handleBackClick}
                                    >
                                        Back to Home
                                    </Button>
                                </Paper> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Menu Dialog */}
                <Dialog
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        style: {
                            backgroundColor: 'white',
                            color: '#333',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }
                    }}
                >
                    <DialogTitle style={{ color: '#333' }}>Return to Home?</DialogTitle>
                    <DialogContent>
                        <Typography style={{ color: '#333' }}>Are you sure you want to return to the home screen?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleMenuClose}
                            sx={{
                                color: '#666',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBackClick}
                            variant="contained"
                            sx={{
                                backgroundColor: 'var(--primary-color)',
                                '&:hover': {
                                    backgroundColor: 'var(--button-hover-color)'
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
};

Leaderboard.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
            Id: PropTypes.string.isRequired,
            Pfp: PropTypes.string.isRequired,
            Name: PropTypes.string.isRequired,
            Score: PropTypes.string.isRequired,
            GameMode: PropTypes.string.isRequired,
            Time: PropTypes.string.isRequired
        })
    ).isRequired,
};

// Default props for when socket data isn't available
Leaderboard.defaultProps = {
    players: []
};

export default Leaderboard;