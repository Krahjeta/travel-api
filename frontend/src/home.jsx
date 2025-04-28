import React from 'react';
import backgroundVideo from './photos/background.mp4'; // Import video from src/photos

function Home() {
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background Video */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', // Make the video smaller (80% of the screen width)
          height: '80%', // Adjust height proportionally
          overflow: 'hidden',
          borderRadius: '20px', // Optional: rounded corners
          boxShadow: '0 0 20px rgba(0,0,0,0.5)', // Optional: shadow effect
          zIndex: '-1'
        }}
      >
        <video
          src={backgroundVideo}
          type="video/mp4"
          autoPlay
          muted
          loop
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Content Overlay */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay with transparency
        }}
      >
        <h1
          style={{
            fontWeight: 'bold',
            color: '#F2F2F2',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          Travel
          <img
            src="https://dv4xo43u9eo19.cloudfront.net/assets/scalable/asw_logo_star_white-35480c3b7d4b8eb6083950cde8f6c0e5ed1c49f8d6198992bc42458d3ef0f70a.svg"
            alt="Star Logo"
            style={{ width: '30%' }}
          />
          With
          <img
            src="https://dv4xo43u9eo19.cloudfront.net/assets/scalable/asw_logo_star_white-35480c3b7d4b8eb6083950cde8f6c0e5ed1c49f8d6198992bc42458d3ef0f70a.svg"
            alt="Star Logo"
            style={{ width: '30%' }}
          />
          Joy
        </h1>
      </div>
      
    </div>

    

    
  );
}

export default Home;
