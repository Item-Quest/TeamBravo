import React, { useRef, useEffect } from 'react';
import { loadModelAndPredict } from '../utils/imagePredict';

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
        console.log(`Predicted Label: ${label}`);
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
