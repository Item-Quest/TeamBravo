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

const SupportModal = ({ isOpen, onClose}) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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

    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Send Help and Support</DialogTitle>
        <DialogTitle className="support-page-context">By clicking submit, your default email application will open a new message with your inquiry to <strong>itemquesthelpdesk@gmail.com</strong>.</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Your Inquiry"
            type="text"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline // Allows more lines
            rows={4} // Controls height
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              sendEmail();
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
    onClose: PropTypes.func.isRequired
}

export default SupportModal;