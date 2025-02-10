import React, { useRef, useEffect } from 'react';

function Camera() {
  const videoRef = useRef(null);

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

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay />
    </div>
  );
}

export default Camera;