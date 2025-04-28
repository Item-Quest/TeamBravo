// client/src/components/JoinGameModal.jsx
// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import click from "../assets/SFX/click.wav"
import backClick from "../assets/SFX/backclick.wav"

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from "@mui/material";
import PropTypes from 'prop-types';

const JoinGameModal = ({ isOpen, onClose, onJoin}) => {
  //state for getting username and room code
  // const [username, setUsername] = useState("Anonymous");
  const [roomCode, setRoomCode] = useState("");

  const [uiVolume] = useState(() => {
    const storedVolume = localStorage.getItem('uiVolume');
    return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
  });
  const clickSound = new Audio(click);
  clickSound.volume = uiVolume
  const backClickSound = new Audio(backClick);
  backClickSound.volume = uiVolume

  // Common text field styling
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
        borderWidth: '1px'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--primary-color)'
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--primary-color)' // Keep the label color consistent with border
    },
    '& .MuiInputBase-input': {
      color: '#333' // Default text color
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: 'white',
          color: '#333',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle style={{ color: '#333' }}>Join Game</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter Room Code"
          type="text"
          fullWidth
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          sx={textFieldStyle}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            backClickSound.play();
            onClose();
          }}
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
          onClick={() => {
            clickSound.play();
            // Handle join logic
            onJoin(roomCode);
          }}
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--primary-color)',
            '&:hover': {
              backgroundColor: 'var(--button-hover-color)'
            }
          }}
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

JoinGameModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onJoin: PropTypes.func.isRequired
};

export default JoinGameModal;