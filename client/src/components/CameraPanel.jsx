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
        flex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        color: "white",
        padding: 2,
        borderRadius: "8px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Test Your Camera
      </Typography>
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        How to play instructions here...
      </Typography>
      <Box
        sx={{
          width: "90%",
          height: "300px",
          backgroundColor: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          padding: 2,
        }}
      >
        <Camera />
      </Box>
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        How to play instructions here...
      </Typography>
    </Box>
  );
};

CameraPanel.propTypes = {};

export default CameraPanel;