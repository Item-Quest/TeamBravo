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
          const predictions = await loadModelAndPredict(imageData);

          context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing the new frame
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height); // Redraw the video frame

        if(Array.isArray(predictions) && predictions.length > 0) {
          // Check if the first prediction has a bounding box
          const pred = predictions[0];

          if (pred?.bbox) {
            // COCO-SSD prediction with bounding box (bbox and label)
            const [x, y, width, height] = pred.bbox;
            context.strokeStyle = 'green';
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);

            context.fillStyle = 'green';
            context.font = '16px Arial';
            context.textAlign = 'center';
            context.fillText(pred.label, x, y > 20 ? y - 5 : y + 15);

          }
          /*
             else {
            // Teachable Machine fallback (no bbox)
            context.fillStyle = 'blue';
            context.font = '24px Arial';
            context.textAlign = 'center';
            context.fillText(pred.label, canvas.width / 2, canvas.height - 10);
          }

          */   // Uncomment this if you want to draw the bounding box for Teachable Machine predictions as well

          props.getAIOutput(pred.label || 'no_item');
        } else {
          console.warn("No predictions available");
          props.getAIOutput("no_item");
        }
      } catch (error) {
        console.error('Prediction error:', error);
      }

      // Every 500ms, clear the canvas and redraw the video frame
      timeoutId.current = setTimeout(processFrame, 500);
      };

    getCameraStream();

    if (props.gameState === "running") {
      timeoutId.current = setTimeout(processFrame, 500);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [props.getAIOutput, props.gameState]);

  return (
    <div className="camera-container" style={{ position: 'relative' }}>
      <video ref={videoRef} autoPlay width={640} height={480} />
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