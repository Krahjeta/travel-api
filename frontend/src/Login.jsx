import React from 'react';

function Login() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Login</h1>
      <form>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            style={{ padding: '8px', width: '100%', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            style={{ padding: '8px', width: '100%', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ backgroundColor: '#950606', color: 'white', padding: '10px 20px', width: '100%' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
