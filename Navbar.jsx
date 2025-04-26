import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px', 
      backgroundColor: '#4CAF50' 
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '24px', color: 'white' }}>
        Travel Agency
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="home.jsx">Home</Link>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/destinations">Destinations</Link>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/about">About Us</Link>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;

