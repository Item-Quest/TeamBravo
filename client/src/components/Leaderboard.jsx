import { useNavigate } from 'react-router-dom';
import { Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Leaderboard = (props) => {
    const navigate = useNavigate();

    const BackClick = () => {
        navigate("/home");
    }

    return (
        <Paper elevation={6} sx={{ padding: 3, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px", width: "80vw", maxWidth: "1200px", margin: "0 auto" }}>
            <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>Leaderboard</Typography>
            <List>
                {props.players.sort((a, b) => b.Score - a.Score).map((player, index) => (
                    <ListItem key={player.Id}>
                        <ListItemAvatar>
                            <Avatar src={player.Pfp} alt="Player Profile" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={player.Name}
                            secondary={`Score: ${player.Score}`}
                            sx={{
                                '& .MuiListItemText-primary': { fontWeight: 'bold' },
                                '& .MuiListItemText-secondary': { color: 'text.secondary' }
                            }}
                        />
                        <Typography>{index + 1}</Typography>
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" onClick={BackClick} sx={{ display: 'block', margin: '20px auto 0' }}>Back</Button>
        </Paper>
    )
}

Leaderboard.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
            Id: PropTypes.string.isRequired,
            Pfp: PropTypes.string.isRequired,
            Name: PropTypes.string.isRequired,
            Score: PropTypes.number.isRequired
        })
    ).isRequired,
};

export default Leaderboard;

