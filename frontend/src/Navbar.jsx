import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px', 
      backgroundColor: 'white' 
    }}>
      
      {/* Left side: Logo */}
      <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#950606' }}>
        Travel Agency
      </div>
      
      {/* Middle: Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/">Home</Link>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/book">Book Ticket</Link>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/myticket">My Ticket</Link>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/offers">Offers</Link>
      </div>
      
      {/* Right side: Sign-in and Sign-up Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link 
          to="/signin"
          style={{
            backgroundColor: '#950606',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Sign In
        </Link>
        <Link 
          to="/signup"
          style={{
            backgroundColor: 'white',
            color: '#950606',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            border: '2px solid #950606'
          }}
        >
          Sign Up
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;

