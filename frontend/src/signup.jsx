import React, { useState } from 'react';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      alert(`Name: ${name}\nEmail: ${email}\nPassword: ${password}`);
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="phoneNumber"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your Phone Number"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '0' }}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#950606',
              color: 'white',
              padding: '10px 20px',
              width: '100%',
              border: 'none'
            }}
            className="btn"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
