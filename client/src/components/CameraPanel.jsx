// client/src/components/CameraPanel.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Typography } from "@mui/material";
import Camera from "./Camera";

const CameraPanel = () => {
  console.log("CameraPanel rendering"); // Log statement
  return (
    <Box
      sx={{
        flex: { xs: 1, md: 2 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        color: "white",
        padding: { xs: 1, sm: 2 },
        borderRadius: "8px",
        margin: { xs: '10px 0', md: 0 }, // Add margin on mobile for separation
      }}
    >
      <Typography variant="h5" gutterBottom>
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          marginTop: 2,
          fontSize: { xs: '0.875rem', md: '1rem' },
          textAlign: 'center'
        }}
      >
      Test Your Camera
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: { xs: "250px", sm: "300px" },
          backgroundColor: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          padding: { xs: 1, sm: 2 },
          overflow: "hidden"
        }}
      >
        <Camera height="100%" width="100%" maxWidth="100%" />
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          marginTop: 2,
          fontSize: { xs: '0.875rem', md: '1rem' },
          padding: { xs: '0 8px', md: 0 },
          textAlign: 'center'
        }}
      >
        How to play instructions here...
      </Typography>
    </Box>
  );
};

CameraPanel.propTypes = {};

export default CameraPanel;