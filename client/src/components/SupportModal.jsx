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

const SupportModal = ({ isOpen, onClose, onSupport}) => {
  //state for getting username and room code
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Help and Support</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Email"
            type="text"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Your Inquiry"
            type="text"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle support logic
              onSupport(email, question);
              //onClose();
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
};

SupportModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSupport: PropTypes.func.isRequired
}

export default SupportModal;