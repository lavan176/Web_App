import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capturePhoto = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  const uploadPhoto = async () => {
    if (!imageSrc) return alert('Capture a photo first!');
    
    try {
      const response = await axios.post('http://localhost:5000/upload', { image: imageSrc });
      alert('Photo uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div>
      <h1>Photo Capture App</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
      />
      <button onClick={capturePhoto}>Capture Photo</button>
      {imageSrc && <img src={imageSrc} alt="Captured" />}
      <button onClick={uploadPhoto}>Upload Photo</button>
    </div>
  );
};

export default App;
