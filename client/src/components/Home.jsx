// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, IconButton, Tooltip, AppBar, Toolbar, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import MessageIcon from '@mui/icons-material/Message';

import NavigationPanel from "./NavigationPanel";
import CameraPanel from "./CameraPanel";
import JoinGameModal from "./JoinGameModal";
import CreateGameModal from "./CreateGameModal"; 
import { joinGame } from "../dataProvider.js";

import SupportModal from "./SupportModal"
import click from "../assets/SFX/click.wav"

const Home = (updateGame) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [uiVolume] = useState(() => {
    const storedVolume = localStorage.getItem('uiVolume');
    return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
  });
  
  const clickSound = new Audio(click);
  clickSound.volume = uiVolume

  const joinClick = () => {
    setIsModalOpen(true);
  };

  const createClick = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false); 
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const SupportClick = () => {
    clickSound.play();
    setIsSupportOpen(true);
  };

  const handleSupportClose = () => {
    setIsSupportOpen(false);
  };

  const handleJoin = (roomCode) => {
    console.log("Join attempt");
    console.log(roomCode);
    joinGame(roomCode, (result) => {
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
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'var(--text-color)' }}>
            Item Quest
          </Typography>
          <Tooltip title="Help & Support">
            <IconButton onClick={SupportClick} sx={{ color: 'var(--text-color)' }} aria-label="help and support">
              <MessageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="GitHub Repository">
            <IconButton
              sx={{ color: 'var(--text-color)' }}
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

      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flex: 1,
        padding: { xs: '20px 0', md: '40px 0' }
      }}>
        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "95vw", sm: "90vw", md: "80vw" },
            maxWidth: "1200px",
            minHeight: { xs: "auto", md: "600px" },
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "transparent",
            margin: "0 auto",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* Background gradient overlay */}
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "transparent",
            borderRadius: "16px",
            zIndex: 0,
          }} />

          {/* Content container with proper padding and spacing */}
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
            padding: { xs: 2, md: 3 },
            gap: { xs: 3, md: 4 },
            boxSizing: "border-box"
          }}>
            <Box sx={{ 
              flex: { xs: '1', md: '0 0 300px' },
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', md: '100%' },
              backgroundColor: "transparent",
              padding: 0,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box"
            }}>
              <NavigationPanel onJoinClick={joinClick} onCreateClick={createClick} />
            </Box>
            <Box sx={{ 
              flex: '1', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: { xs: 'auto', md: '100%' },
              backgroundColor: "transparent",
              padding: 0,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box"
            }}>
              <CameraPanel />
            </Box>
          </Box>

          <JoinGameModal
            isOpen={isModalOpen}
            onClose={handleClose}
            onJoin={handleJoin}
          />
              
          <CreateGameModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            updateGame={updateGame}
            navigate={navigate}  
           />

          <SupportModal
            isOpen={isSupportOpen}
            onClose={handleSupportClose}
          />
        </Paper>
      </Box>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        width: '80vw', 
        maxWidth: '1200px', 
        margin: '20px auto',
        padding: '10px',
        color: 'var(--text-color)'
      }}>
        &copy; 2025 Team Bravo. All rights reserved.
      </div>
    </Box>
  );
};

export default Home;
