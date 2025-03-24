// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper } from "@mui/material";

import NavigationPanel from "./NavigationPanel";
import CameraPanel from "./CameraPanel";
import JoinGameModal from "./JoinGameModal";
import {joinGame} from "../dataProvider.js";

const Home = (updateGame) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const JoinClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleJoin = (username, roomCode) => {
    console.log("Join attempt");
    console.log(username, roomCode);
    joinGame(username, roomCode, (result) => {
      if (result.success) {
        console.log("made it to result.success");
        setIsModalOpen(false);
        console.log("made it here as well");
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
      <nav style={{ width: 'auto', boxSizing: 'border-box', backgroundColor: 'rgba(0,0,0,0.1)', padding: '10px' }}>
        {/* Navbar content will go here later */}
      </nav>
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          width: "80vw",
          maxWidth: "1200px",
          minHeight: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          padding: 3,
          backgroundColor: "rgba(255, 255, 255, 0.08)", // Optional transparency
        }}
      >
        <NavigationPanel onJoinClick={JoinClick} />
        <CameraPanel />

        <JoinGameModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onJoin={handleJoin}
        />
      </Paper>
        <div style={{ textAlign: 'center', marginTop: '20px', width: '80vw', maxWidth: '1200px', margin: '0 auto' }}>
          © 2025 Team Bravo. All rights reserved.
        </div>
    </Box>
  );
};

export default Home;
