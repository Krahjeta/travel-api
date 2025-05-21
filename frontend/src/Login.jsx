import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <form>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <button className='btn btn-success'
            style={{ backgroundColor: '#950606', color: 'white', padding: '10px 20px', width: '100%', marginBottom: '10px' }}>
            Login
          </button>
          <Link to="/signup" className='btn btn-default border' style={{ width: '100%' }}>
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
