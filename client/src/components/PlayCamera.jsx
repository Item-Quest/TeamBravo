import React, { useRef, useEffect } from 'react';
import { loadModelAndPredict } from '../utils/imagePredict';

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
            width: { ideal: 640 },
            height: { ideal: 480 }
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