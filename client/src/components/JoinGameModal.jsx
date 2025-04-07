// client/src/components/JoinGameModal.jsx
// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import PropTypes from 'prop-types';
import { playSFX } from '../utils/SFXHelper';
import click from '../assets/SFX/click.wav';
import backclick from '../assets/SFX/backclick.wav';

const JoinGameModal = ({ isOpen, onClose, onJoin}) => {
  //state for getting username and room code
  const [username, setUsername] = useState("Anonymous");
  const [roomCode, setRoomCode] = useState("");

    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Join Game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Username"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Room Code"
            type="text"
            fullWidth
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button  onClick={() => {
            playSFX(backclick);
            onClose();
            }} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              playSFX(click);
              // Handle join logic
              onJoin(username, roomCode);
              //onClose();
            }}
            color="primary"
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
}

export default JoinGameModal;