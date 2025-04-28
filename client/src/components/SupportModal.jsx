// client/src/components/SupportModal.jsx
// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import PropTypes from 'prop-types';
import backClick from "../assets/SFX/backclick.wav"

const SupportModal = ({ isOpen, onClose}) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
    const [uiVolume] = useState(() => {
      const storedVolume = localStorage.getItem('uiVolume');
      return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
    });
    
    const backClickSound = new Audio(backClick);
    backClickSound.volume = uiVolume

  const sendEmail = () => {
    if (!name || !message) {
      alert("Error: Name and message are required.");
      return;
    } 
    var mName=encodeURIComponent(name);
    var mMessage=encodeURIComponent(message);
    onClose();
    window.location.href="mailto:itemquesthelpdesk@gmail.com?subject=Support Ticket from "+mName+"&body="+mMessage;
  };

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
      },
      '&.Mui-focused input': {
        color: '#333' // Keep text color black when focused
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
      <DialogTitle style={{ color: '#333' }}>Send Help and Support</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, color: '#666', fontSize: '0.9rem' }}>
          By clicking submit, your default email application will open a new message with your inquiry to <strong>itemquesthelpdesk@gmail.com</strong>.
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={textFieldStyle}
        />
        <TextField
          margin="dense"
          label="Enter Your Inquiry"
          type="text"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
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
          onClick={sendEmail}
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--primary-color)',
            '&:hover': {
              backgroundColor: 'var(--button-hover-color)'
            }
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SupportModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default SupportModal;