import React, { useRef, useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import { loadModelAndPredict } from '../utils/imagePredict';
import { submitLabel } from './testcomponents/TestGame'

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };
    getCameraStream();
  }, []);

  useEffect(() => {
    const processFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        requestAnimationFrame(processFrame);
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Draw the current video frame onto the canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      try {
        // Predict the label using imageProcess.js
        const label = await loadModelAndPredict(imageData);
        // const label = "asdf"
        console.log(`Predicted Label: ${label}`);
        submitLabel(label); // should send to testGame which will send to server if game on

      } catch (error) {
        console.error('Prediction error:', error);
      }

      requestAnimationFrame(processFrame);
    };

    requestAnimationFrame(processFrame);
  }, []);

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
    </div>
  );
}

export default Camera;

// Need to fix
// const CameraPanel = () => {
//   console.log("CameraPanel rendering"); // Log statement
//   return (
//     <Box
//       sx={{
//         flex: 2,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "black",
//         color: "white",
//         padding: 2,
//         borderRadius: "8px",
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         Test Your Camera
//       </Typography>
//       <Typography variant="body2" sx={{ marginTop: 2 }}>
//         How to play instructions here...
//       </Typography>
//       <Box
//         sx={{
//           width: "90%",
//           height: "300px",
//           backgroundColor: "#222",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: "8px",
//           padding: 2,
//         }}
//       >
//         <Camera />
//       </Box>
//       <Typography variant="body2" sx={{ marginTop: 2 }}>
//         How to play instructions here...
//       </Typography>
//     </Box>
//   );
// };

// CameraPanel.propTypes = {};

// export default CameraPanel;