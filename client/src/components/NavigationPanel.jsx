// client/src/components/NavigationPanel.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, useMediaQuery, useTheme } from "@mui/material";
import logo from "../assets/logo2.png";
import PropTypes from 'prop-types';
import { createGame } from "../dataProvider.js";

const NavigationPanel = ({ onJoinClick, onCreateClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



  return (
    <Box
      sx={{
        flex: { xs: 'auto', md: 1 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: { xs: 1, sm: 2 },
        width: { xs: '100%', md: 'auto' },
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: isMobile ? "80px" : "100px",
          marginBottom: isMobile ? 12 : 16
        }}
      />

      {/* Buttons */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: "90%",
          height: { xs: 50, md: 60 },
          fontSize: { xs: "16px", md: "18px" },
          mb: { xs: 1.5, md: 2 }
        }}
        onClick={onJoinClick}
      >
        JOIN GAME
      </Button>

      <Button
        variant="contained"
        sx={{
          width: "90%",
          height: { xs: 45, md: 50 },
          fontSize: { xs: "14px", md: "16px" },
          mb: { xs: 1.5, md: 2 }
        }}
        // onClick={() => navigate("/create")}
        onClick={() => {
          var newGame = createGame((result) => {
            props.updateGame(result.roomCode, result.sid);
          });
          navigate("/play");
        }}

      >
        CREATE GAME
      </Button>

      <Button
        variant="contained"
        sx={{
          width: "90%",
          height: { xs: 45, md: 50 },
          fontSize: { xs: "14px", md: "16px" },
          mb: { xs: 1.5, md: 2 }
        }}
        onClick={() => navigate("/leaderboard")}
      >
        LEADER BOARD
      </Button>

      {/* Settings & Backend Buttons */}
      <Box sx={{
        display: "flex",
        width: "90%",
        justifyContent: "space-between",
        flexDirection: { xs: isMobile ? "column" : "row", md: "row" }
      }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: isMobile ? "100%" : "48%", md: "48%" },
            height: { xs: 45, md: 50 },
            fontSize: { xs: "14px", md: "16px" },
            mb: isMobile ? 1 : 0
          }}
          onClick={() => navigate("/MenuSettings")}
        >
          SETTINGS
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: { xs: isMobile ? "100%" : "48%", md: "48%" },
            height: { xs: 45, md: 50 },
            fontSize: { xs: "14px", md: "16px" }
          }}
          onClick={() => navigate("/Login")}

        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

NavigationPanel.propTypes = {
  onJoinClick: PropTypes.func.isRequired,
};

export default NavigationPanel;
