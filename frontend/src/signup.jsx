import React, { useState } from 'react';
import Validation from './SignupValidation';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = Validation(values, confirmPassword);
    setErrors(validationErrors);

    const noErrors = Object.values(validationErrors).every(err => err === '');
    if (noErrors) {
      // Add role here: always "user" on signup
      fetch('http://localhost:8081/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, role: 'user' })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        navigate('/signin');
      })
      .catch(err => console.error("Signup error:", err));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          {/* ... your inputs unchanged ... */}
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleInput}
              placeholder="Enter your full name"
              className="form-control"
              style={{ padding: '8px', width: '95%', marginTop: '5px', borderRadius: '0' }}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleInput}
              placeholder="Enter your email"
              className="form-control"
              style={{ padding: '8px', width: '95%', marginTop: '5px', borderRadius: '0' }}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleInput}
              placeholder="Enter your password"
              className="form-control"
              style={{ padding: '8px', width: '95%', marginTop: '5px', borderRadius: '0' }}
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="form-control"
              style={{ padding: '8px', width: '95%', marginTop: '5px', borderRadius: '0' }}
            />
            {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: '#950606', color: 'white', padding: '10px 20px', width: '100%', border: 'none' }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
