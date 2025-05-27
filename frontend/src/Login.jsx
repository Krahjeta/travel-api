import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';

function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    const noErrors = Object.values(validationErrors).every(err => !err || err === '');
    if (!noErrors) return;

    try {
      const res = await fetch('http://localhost:8081/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to login');
      }

      const data = await res.json();

      // Save the full user object (including role) in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to offers or home page
      navigate('/offers');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleInput}
              className="form-control"
              style={{ padding: '8px', width: '95%', marginTop: '5px' }}
              required
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleInput}
              className="form-control"
              style={{ padding: '8px', width: '95%', marginTop: '5px' }}
              required
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-success"
            style={{
              backgroundColor: '#950606',
              color: 'white',
              padding: '10px 20px',
              width: '100%',
              marginBottom: '10px',
            }}
          >
            Login
          </button>

          <Link
            to="/signup"
            className="btn btn-default border"
            style={{ width: '100%', textAlign: 'center', display: 'block' }}
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
