import React from 'react';
import backgroundVideo from './photos/background.mp4'; 
function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            overflow: 'hidden',
            borderRadius: '20px',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
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
        
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
              fontSize: '3rem',
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
      
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '80px 20px',
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{
            color: 'white',
            fontSize: '1.5rem',
            marginBottom: '20px',
            maxWidth: '600px',
            lineHeight: '1.6',
            margin: '0 auto',
          }}>
            Discover amazing destinations, book incredible flights, and create unforgettable memories with our travel platform.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto 80px auto',
        }}>
          {/*  1 */}
          <div style={{
            backgroundColor: 'rgba(245, 240, 240, 0.7)',
            padding: '40px 30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✈️</div>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.4rem' }}>
              Flight Booking
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Search and book flights to your dream destinations with the best prices and convenient schedules.
            </p>
          </div>
          {/*  2 */}
          <div style={{
            backgroundColor: 'rgba(245, 240, 240, 0.7)',
            padding: '40px 30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.4rem' }}>
              Special Offers
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Exclusive deals and limited-time offers for popular destinations around the world.
            </p>
          </div>
          {/* 3 */}
          <div style={{
            backgroundColor: 'rgba(245, 240, 240, 0.7)',
            padding: '40px 30px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌍</div>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '1.4rem' }}>
              Global Destinations
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Explore cities worldwide with our comprehensive network of airlines and destinations.
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '80px',
          flexWrap: 'wrap',
          marginBottom: '80px',
          maxWidth: '800px',
          margin: '0 auto 80px auto',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#950606', fontSize: '3rem', fontWeight: 'bold' }}>500+</div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Destinations</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#950606', fontSize: '3rem', fontWeight: 'bold' }}>50+</div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Airlines</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#950606', fontSize: '3rem', fontWeight: 'bold' }}>24/7</div>
            <div style={{ color: '#666', fontSize: '1.1rem' }}>Support</div>
          </div>
        </div>
      
        <div style={{
          textAlign: 'center',
          backgroundColor: '#950606',
          padding: '50px 40px',
          borderRadius: '20px',
          maxWidth: '600px',
          margin: '0 auto',
          color: 'white',
        }}>
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '1.8rem' }}>
            Ready to Start Your Journey?
          </h3>
          <p style={{ color: 'white', marginBottom: '30px', opacity: 0.9, fontSize: '1.1rem' }}>
            Join thousands of travelers who trust us for their adventures
          </p>
          <button
            onClick={() => window.location.href = '/signin'}
            style={{
              backgroundColor: 'white',
              color: '#950606',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '10px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;