import React, { useRef, useEffect } from 'react';
import { loadModelAndPredict } from '../utils/imagePredict';

function PlayCamera(props) {
  console.log("component mounted");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const timeoutId = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };

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
          //console.log(`Predicted Label: ${label}`);
          props.getAIOutput(label)
        } catch (error) {
          console.error('Prediction error:', error);
        }
  
        // Schedule the next frame processing after 1 second
        timeoutId.current = setTimeout(() => {
          animationFrameId.current = requestAnimationFrame(processFrame);
        }, 1000);
      };
      getCameraStream()
      if (props.gameState === "running") {
        animationFrameId.current = requestAnimationFrame(processFrame);
      }
  
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
  }, [props.getAIOutput, props.gameState]);

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
    </div>
  );
}

export default PlayCamera;