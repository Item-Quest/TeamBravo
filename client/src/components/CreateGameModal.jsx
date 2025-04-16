import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { createGame, updateUsername } from '../dataProvider.js';
import PropTypes from 'prop-types';

const CreateGameModal = ({ isOpen, onClose, updateGame, navigate }) => {
  const [username, setUsername] = useState("");
  const [gameMode, setGameMode] = useState("ItemRace");

  const playClick = () => {
    if (!username.trim()) return;

    console.log("Creating game with mode:", gameMode);
    let roomCode;
    createGame(gameMode, (result) => {
      roomCode = result.roomCode;
      navigate("/play");
    });
    updateUsername(username);
    navigate("/play");
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create a New Game</DialogTitle>
      <DialogContent>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="game-mode-label">Game Mode</InputLabel>
          <Select
            labelId="game-mode-label"
            value={gameMode}
            label="Game Mode"
            onChange={(e) => setGameMode(e.target.value)}
          >
            <MenuItem value="ItemRace">Item Race</MenuItem>
            <MenuItem value="ItemBlitz">Item Blitz</MenuItem>
            <MenuItem value="GeoQuest">Geo</MenuItem>
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={playClick} color="primary">Create Game</Button>
      </DialogActions>
    </Dialog>
  );
};

CreateGameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CreateGameModal;
