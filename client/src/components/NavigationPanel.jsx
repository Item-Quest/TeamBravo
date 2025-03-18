// client/src/components/NavigationPanel.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import logo from "../assets/logo2.png";
import PropTypes from 'prop-types';

const NavigationPanel = ({ onJoinClick }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <img src={logo} alt="Logo" style={{ width: "100px", marginBottom: 16 }} />

      {/* Buttons */}
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "90%", height: 60, fontSize: "18px", mb: 2 }}
        onClick={onJoinClick}
      >
        JOIN GAME
      </Button>

      <Button
        variant="contained"
        sx={{ width: "90%", height: 50, fontSize: "16px", mb: 2 }}
        onClick={() => navigate("/create")}
      >
        CREATE GAME
      </Button>

      <Button
        variant="contained"
        sx={{ width: "90%", height: 50, fontSize: "16px", mb: 2 }}
        onClick={() => navigate("/leaderboard")}
      >
        LEADER BOARD
      </Button>

      {/* Settings & Backend Buttons */}
      <Box sx={{ display: "flex", width: "90%", justifyContent: "space-between" }}>
        <Button variant="outlined" sx={{ width: "48%" }} onClick={() => navigate("/MenuSettings")}>
          Settings
        </Button>
        <Button variant="outlined" sx={{ width: "48%" }} onClick={() => navigate("/TestHome")}>
          Backend
        </Button>
      </Box>
    </Box>
  );
};

NavigationPanel.propTypes = {
  onJoinClick: PropTypes.func.isRequired,
};

export default NavigationPanel;