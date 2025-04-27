import React from 'react';
import backgroundVideo from './photos/background.mp4'; // Import video from src/photos

function Home() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Background Video */}
      <video
        src={backgroundVideo} // Use the imported video
        type="video/mp4"
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      {/* Content Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
          opacity: '0.3', // Slight dark overlay to make text readable
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
            marginBottom: '24px',
            paddingBottom: '24px',
            '@media (min-width: 768px)': {
              flexDirection: 'row',
            },
            '@media (min-width: 992px)': {
              gap: '8px',
            },
            '@media (min-width: 1200px)': {
              gap: '20px',
            },
          }}
        >
          Travel
          <img
            className="g-col-6 width-30"
            src="https://dv4xo43u9eo19.cloudfront.net/assets/scalable/asw_logo_star_white-35480c3b7d4b8eb6083950cde8f6c0e5ed1c49f8d6198992bc42458d3ef0f70a.svg"
            alt="Star Logo"
            style={{ width: '30%' }}
          />
          With
          <img
            className="g-col-6 width-30"
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
