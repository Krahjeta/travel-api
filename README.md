import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Our Website!</h1>
      <p>Your journey starts here. Explore and enjoy!</p>
      <button style={styles.button}>Get Started</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '5rem',
  },
  button: {
    marginTop: '2rem',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};

export default Home;
