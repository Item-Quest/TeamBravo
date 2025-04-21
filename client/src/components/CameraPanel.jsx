// client/src/components/CameraPanel.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Camera from "./Camera";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CameraPanel = () => {
  return (
    <Box
      className="nav-panel-container camera-panel-container"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        width: "100%",
        maxHeight: { xs: "100%", sm: "none" }
      }}
    >
      {/* Decorative elements */}
      <div className="nav-decoration nav-decoration-1"></div>
      <div className="nav-decoration nav-decoration-2"></div>
      <div className="nav-decoration nav-decoration-3"></div>
      
      {/* Camera Header */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          mb: { xs: 0, sm: 1 },
          position: "relative",
          zIndex: 1
        }}
      >
        <CameraAltIcon sx={{ mr: 1, color: "var(--accent-color)" }} />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: "bold",
            color: "var(--text-color)",
            fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
            textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            fontSize: { xs: "1.2rem", sm: "1.5rem" }
          }}
        >
          Test Your Camera
        </Typography>
      </Box>
      
      {/* Camera Container */}
      <Box
        sx={{
          width: "100%",
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          padding: 0,
          overflow: "hidden",
          position: "relative",
          border: "3px solid var(--text-color)",
          boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
          zIndex: 1,
          mb: { xs: 1, sm: 1 },
          mt: { xs: 1, sm: 2 },
          minHeight: { xs: "300px", sm: "400px" }
        }}
      >
        <Camera height="100%" width="100%" maxWidth="100%" />
        
        {/* Camera overlay with instructions */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: { xs: 1, sm: 2 },
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            display: "flex",
            alignItems: "center",
            zIndex: 2
          }}
        >
          <InfoOutlinedIcon sx={{ mr: 1, color: "var(--accent-color)", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: "white",
              fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
              fontSize: { xs: "0.7rem", sm: "0.9rem" },
              textTransform: "uppercase"
            }}
          >
            Position items clearly in frame for best results
          </Typography>
        </Box>
      </Box>
      
      {/* Bottom instruction box */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "rgba(255, 105, 180, 0.7)",
          borderRadius: "12px",
          padding: { xs: 1, sm: 2 },
          textAlign: "center",
          border: "2px solid var(--text-color)",
          boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
          zIndex: 1
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            color: "white",
            fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            fontSize: { xs: "0.8rem", sm: "1rem" },
            textTransform: "uppercase"
          }}
        >
          Show objects to your camera to play Item Quest!
          <br />
          Join or create a game to get started.
        </Typography>
      </Box>
    </Box>
  );
};

CameraPanel.propTypes = {};

export default CameraPanel;