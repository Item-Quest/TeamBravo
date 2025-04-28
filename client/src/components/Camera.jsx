import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('loading'); // 'loading', 'ready', 'error'

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // original camera implementation
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment', // Use the back camera by default
            frameRate: { ideal: 30, max: 60 } // Smoother capture if hardware supports it
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraStatus('ready');
          };
        }
      } catch (error) {
        console.error('Error accessing the camera', error);
        setCameraStatus('error');
      }
    };
    getCameraStream();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {cameraStatus === 'loading' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography variant="body2" sx={{ mt: 2, color: 'white' }}>
            Accessing camera...
          </Typography>
        </Box>
      )}
      
      {cameraStatus === 'error' && (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <VideocamOffIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
            Camera access denied or not available
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
            Please check your browser permissions and try again
          </Typography>
        </Box>
      )}
      
      {cameraStatus === 'ready' && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            p: 0.5,
            zIndex: 2
          }}
        >
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
        </Box>
      )}
      
      <video 
        ref={videoRef} 
        autoPlay 
        muted
        playsInline
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: cameraStatus === 'ready' ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} 
      />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
    </Box>
  );
}

export default Camera;
