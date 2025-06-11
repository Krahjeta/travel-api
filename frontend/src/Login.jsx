import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';

function Login({ setUser }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setServerError(''); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await fetch('http://localhost:8081/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setServerError(errorData.error || 'Failed to login');
        return;
      }

      const data = await res.json();

      if (data.user && data.token) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/offers');
      } else {
        setServerError('Invalid login response from server.');
      }
    } catch (error) {
      setServerError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleInput}
              style={{ padding: '8px', width: '95%', marginTop: '5px' }}
              required
            />
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
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
              style={{ padding: '8px', width: '95%', marginTop: '5px' }}
              required
            />
            {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
          </div>

          {serverError && <div style={{ color: 'red', marginBottom: '10px' }}>{serverError}</div>}

          <button type="submit" style={{
            backgroundColor: '#950606',
            color: 'white',
            padding: '10px 20px',
            width: '100%',
            marginBottom: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Login
          </button>

          <Link
            to="/signup"
            style={{
              width: '100%',
              display: 'block',
              textAlign: 'center',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textDecoration: 'none',
              color: '#333',
            }}
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
