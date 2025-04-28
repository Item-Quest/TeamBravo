import React, { useRef, useEffect } from 'react';
import { loadModelAndPredict } from '../utils/imagePredict';

// Function to calculate the average brightness of an image
// This function is used to determine if the camera is in a well-lit environment & adjusts the model accordingly
  function calculateAverageBrightness(imageData) {
    let totalBrightness = 0;
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
    }

    return totalBrightness / (data.length / 4);
  }


function PlayCamera(props) {
  console.log("component mounted"); // For debugging purposes
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const timeoutId = useRef(null);
  const prevLabelRef = useRef(null); // Ref to store the previous label

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        // Add specific constraints to prevent fullscreen on iOS
        const constraints = {
          video: {
            facingMode: 'environment', // Use the back camera by default
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30, max: 60 } // Smoother capture if hardware supports it
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };

    const processFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        timeoutId.current = setTimeout(processFrame, 300);
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Draw the current video frame onto the canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // --- New Brightness Adjustment Logic ---
      // --- New Brightness Adjustment Code ---
      const avgBrightness = calculateAverageBrightness(imageData);
      const overlayElement = document.querySelector('.camera-dark-overlay');

      if (overlayElement) {
        if (avgBrightness > 200) { // very bright
          overlayElement.style.backgroundColor = 'rgba(0,0,0,0.25)';
        } else if (avgBrightness > 150) { // moderately bright
          overlayElement.style.backgroundColor = 'rgba(0,0,0,0.15)';
        } else { // normal or darker environment
          overlayElement.style.backgroundColor = 'rgba(0,0,0,0.05)';
        }
      }
      // --- End of Brightness Adjustment ---


      try {
        // Predict the label using imageProcess.js
        const predictions = await loadModelAndPredict(imageData);

        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the new frame
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height); // Redraw the video frame

        if (Array.isArray(predictions) && predictions.length > 0) {
          // Check if the first prediction has a bounding box
          const pred = predictions[0];

          if (pred?.bbox && pred?.label) {
            // COCO-SSD prediction with bounding box (bbox and label)
            const [x, y, width, height] = pred.bbox;
            context.strokeStyle = 'black';
            context.lineWidth = 4;
            context.strokeRect(x, y, width, height);
            context.strokeStyle = 'lime';
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);

            // Label
            context.fillStyle = 'lime';
            context.font = '28px Arial';
            context.textAlign = 'center';
            context.strokeText(pred.label, x + width / 2, y > 20 ? y - 5 : y + 20);
            context.fillText(pred.label, x + width / 2, y > 20 ? y - 5 : y + 20);
          }

          // Teachable Machine fallback (no bbox)
          // Commented out for now
          // else {
          //   context.fillStyle = 'blue';
          //   context.font = '28px Arial';
          //   context.textAlign = 'center';
          //   context.fillText(pred.label, canvas.width / 2, canvas.height - 10);
          // }

          // Only call getAIOutput when the label changes
          if (pred && pred.label) {
            const currentLabel = pred.label;
            if (currentLabel !== prevLabelRef.current) {
              props.getAIOutput(currentLabel);
              prevLabelRef.current = currentLabel;
            }
          }
        }

        // Fallback if no predictions available
        else {
          if ('no_item' !== prevLabelRef.current) {
            props.getAIOutput("no_item");
            prevLabelRef.current = "no_item";
          }
        }
      } catch (error) {
        console.error('Prediction error:', error);
      }

      // Every 50ms, clear the canvas and redraw the video frame
      timeoutId.current = setTimeout(processFrame, 50);
    };

    getCameraStream();

    if (props.gameState === "running") {
      timeoutId.current = setTimeout(processFrame, 50); // (Runs the frames around 3-4 times per second)
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [props.getAIOutput, props.gameState]);

  return (
    <div className="camera-container" style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={640}
        height={480}
      />
      <div
        className="camera-dark-overlay"
        // This overlay is used to test the camera and ensure it is working properly within the light conditions
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '640px',
        height: '480px',
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // Test overlay, add 15% darker tint
        pointerEvents: 'none', // Prevent interaction with the overlay
        zIndex: 1, // Ensure the overlay is above the video but below the canvas
      }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}

export default PlayCamera;