// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, IconButton, Tooltip, AppBar, Toolbar, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import MessageIcon from '@mui/icons-material/Message';

import NavigationPanel from "./NavigationPanel";
import CameraPanel from "./CameraPanel";
import JoinGameModal from "./JoinGameModal";
import {joinGame} from "../dataProvider.js";
import {submitSupport} from "../dataProvider.js";

import SupportModal from "./SupportModal"

const Home = (updateGame) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const JoinClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const SupportClick = () => {
    setIsSupportOpen(true);
  };

  const handleSupportClose = () => {
    setIsSupportOpen(false);
  };

  const handleSupport = (email, question) => {
      submitSupport(email, question, () => {
          setIsSupportOpen(false);
      })
  };

  const handleJoin = (username, roomCode) => {
    console.log("Join attempt");
    console.log(username, roomCode);
    joinGame(username, roomCode, (result) => {
      if (result.success) {
        console.log("made it to result.success");
        setIsModalOpen(false);
        console.log("made it here as well");
        navigate("/play");
      }
      else {
        alert('Invalid room code');
      }
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        color: "text.primary",
      }}
    >
      <AppBar position="static" sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Item Quest
          </Typography>
          <Tooltip title="Help & Support">
            <IconButton onClick={SupportClick} color="inherit" aria-label="help and support">
              <MessageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="GitHub Repository">
            <IconButton 
              color="inherit" 
              aria-label="github repository"
              href="https://github.com/Item-Quest/TeamBravo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ width: '100%', mt: 4 }}>
        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, 
            width: { xs: "95vw", sm: "90vw", md: "80vw" }, 
            maxWidth: "1200px",
            minHeight: { xs: "auto", md: "500px" }, 
            borderRadius: "12px",
            overflow: "hidden",
            padding: { xs: 2, md: 3 }, 
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            margin: "0 auto", 
          }}
        >
          <NavigationPanel onJoinClick={JoinClick} />
          <CameraPanel />

          <JoinGameModal
            isOpen={isModalOpen}
            onClose={handleClose}
            onJoin={handleJoin}
          />

          <SupportModal
            isOpen={isSupportOpen}
            onClose={handleSupportClose}
            onSupport={handleSupport}
          />
        </Paper>
      </Box>
      <div style={{ textAlign: 'center', marginTop: '20px', width: '80vw', maxWidth: '1200px', margin: '0 auto' }}>
        &copy; 2025 Team Bravo. All rights reserved.
      </div>
    </Box>
  );
};

export default Home;
