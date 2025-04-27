// client/src/components/NavigationPanel.jsx
// eslint-disable-next-line no-unused-vars
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import logo from "../assets/logo2.png";
import PropTypes from 'prop-types';
import { createGame } from "../dataProvider.js";
import click from "../assets/SFX/click.wav"


const NavigationPanel = ({ onJoinClick, onCreateClick}) => {


const [uiVolume, setVolume] = useState(() => {
  const storedVolume = localStorage.getItem('uiVolume');
  return storedVolume !== null ? parseFloat(storedVolume) : 0.5;
});

  // Check for volume changes from MenuSettings
  useEffect(() => {
    const checkVolumeChanges = () => {
      const storedVolume = localStorage.getItem('uiVolume');
      if (storedVolume !== null && parseFloat(storedVolume) !== uiVolume) {
        setVolume(parseFloat(storedVolume));
      }
    };

    // Check every second for changes
    const intervalId = setInterval(checkVolumeChanges, 1000);
    
    return () => clearInterval(intervalId);
  }, [uiVolume]);


  const clickSound = new Audio(click);
  clickSound.volume = uiVolume
  

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



  return (
    <Box
      className="nav-panel-container"      
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: { xs: 1, sm: 2 }, 
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden", 
        maxHeight: { xs: "100%", sm: "none" },
        boxSizing: "border-box", 
        maxWidth: "100%" 
      }}
    >
      {/* Decorative elements */}
      <div className="nav-decoration nav-decoration-1"></div>
      <div className="nav-decoration nav-decoration-2"></div>
      <div className="nav-decoration nav-decoration-3"></div>
      
      {/* Top section with logo */}
      <Box sx={{ 
        width: "100%", 
        mb: { xs: 0, sm: 1 }, 
        boxSizing: "border-box", 
        maxWidth: "100%" 
      }}>
        <img
          src={logo}
          alt="Logo"
          className="nav-logo"
          style={{
            width: isMobile ? "120px" : "200px", 
            marginBottom: isMobile ? 0 : 8, 
            position: "relative",
            zIndex: 1,
            display: "block",
            margin: "0 auto"
          }}
        />
      </Box>

      {/* Middle section with main buttons */}
      <Box sx={{ 
        width: "100%", 
        flex: { xs: 1, md: "0 1 auto" }, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "flex-start", 
        paddingTop: { xs: 1, sm: 2 }, 
        minHeight: { xs: "auto", sm: "auto" }, 
        overflowY: "auto",
        boxSizing: "border-box", 
        maxWidth: "100%",
        mb: { xs: 0, md: 'auto' } 
      }}>
        <button
          className="fun-button fun-button-join"
          onClick={() => {
            clickSound.play();
            onJoinClick();
          }}
          style={{ 
            width: '100%', 
            marginBottom: isMobile ? 8 : 18,
            fontSize: isMobile ? "1.1rem" : "1.4rem", 
            padding: isMobile ? "10px 15px" : "15px 20px" 
          }}
        >
          JOIN GAME
        </button>

        <button
          className="fun-button fun-button-create"
          onClick={() => {
            clickSound.play();
            onCreateClick();
          }}
          style={{ 
            width: '100%', 
            marginBottom: isMobile ? 8 : 18,
            fontSize: isMobile ? "1.1rem" : "1.2rem", 
            padding: isMobile ? "8px 15px" : "12px 20px" 
          }}
        >
          CREATE GAME
        </button>

        <button
          className="fun-button fun-button-geo"
          onClick={() =>{
            clickSound.play();
            navigate("/geoquest");
          }}
          style={{ 
            width: '100%', 
            marginBottom: isMobile ? 8 : 18,
            fontSize: isMobile ? "1.1rem" : "1.2rem", 
            padding: isMobile ? "8px 15px" : "12px 20px" 
          }}
        >
          GEO QUEST
        </button>

        <button
          className="fun-button fun-button-leaderboard"
          onClick={() => {
            clickSound.play();
            navigate("/leaderboard");
          }}
          style={{ 
            width: '100%', 
            marginBottom: isMobile ? 8 : 18,
            fontSize: isMobile ? "1.1rem" : "1.2rem", 
            padding: isMobile ? "8px 15px" : "12px 20px" 
          }}
        >
          LEADER BOARD
        </button>
      </Box>

      {/* Bottom section with settings & login */}
      <Box sx={{ 
        width: "100%", 
        boxSizing: "border-box", 
        maxWidth: "100%",
        marginTop: { xs: "auto", md: 4 } 
      }}>
        <div className="button-container">
          <button
            className="fun-button fun-button-settings"
            onClick={() =>{
              clickSound.play();
              navigate("/MenuSettings");
            }}
            style={{ 
              width: '48%',
              fontSize: isMobile ? "0.9rem" : "1.1rem", 
              padding: isMobile ? "6px 10px" : "10px 15px" 
            }}
          >
            SETTINGS
          </button>
          <button
            className="fun-button fun-button-login"
            onClick={() => {
              clickSound.play();
              navigate("/Login");
            }}
            style={{ 
              width: '48%',
              fontSize: isMobile ? "0.9rem" : "1.1rem", 
              padding: isMobile ? "6px 10px" : "10px 15px" 
            }}
          >
            LOGIN
          </button>
        </div>
      </Box>
    </Box>
  );
};

NavigationPanel.propTypes = {
  onJoinClick: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
};

export default NavigationPanel;
