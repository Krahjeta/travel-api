import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Token from localStorage:', token);
      console.log('User from localStorage:', user);
      
      if (token && user) {
        setIsLoggedIn(true);
        try {
          const userData = JSON.parse(user);
          console.log('Parsed user data:', userData);
          console.log('User role:', userData.role);
          setUserName(userData.name || userData.email);
          setIsAdmin(userData.role === 'admin');
        } catch (e) {
          console.error('Error parsing user data:', e);
          setUserName('User');
          setIsAdmin(false);
        }
      } else {
        console.log('No token or user found');
        setIsLoggedIn(false);
        setUserName('');
        setIsAdmin(false);
      }
    };

    checkLoginStatus();

    
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    setIsAdmin(false);
    navigate('/');
  };

  
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
      
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/">Home</Link>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/book">Book Ticket</Link>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/myticket">My Ticket</Link>
        <Link style={{ color: 'grey', textDecoration: 'none' }} to="/offers">Offers</Link>
        {isAdmin && (
          <Link style={{ color: 'grey', textDecoration: 'none' }} to="/dashboard">Dashboard</Link>
        )}
      </div>
      
    
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <span style={{ color: '#950606', fontWeight: 'bold' }}>
              Welcome, {userName}{isAdmin && ' (Admin)'}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#950606',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;