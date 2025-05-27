import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState({
    city: '',
    type: '',
    departureDate: '',
    landingDate: '',
    price: ''
  });

  useEffect(() => {
    fetch(`http://localhost:8081/offers/${id}`)
      .then(res => res.json())
      .then(data => setOffer(data))
      .catch(err => console.error('Failed to fetch offer:', err));
  }, [id]);

  const handleChange = (e) => {
    setOffer(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8081/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update offer');
        return res.json();
      })
      .then(() => {
        alert('Offer updated successfully');
        navigate('/offers');
      })
      .catch(err => {
        console.error('Error updating offer:', err);
        alert('Failed to update offer');
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Offer</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>City:</label>
        <input
          name="city"
          value={offer.city}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="City"
        />

        <label style={styles.label}>Type:</label>
        <input
          name="type"
          value={offer.type}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="One-way or Round-trip"
        />

        <label style={styles.label}>Departure Date:</label>
        <input
          type="datetime-local"
          name="departureDate"
          value={offer.departureDate}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Landing Date:</label>
        <input
          type="datetime-local"
          name="landingDate"
          value={offer.landingDate}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Price (€):</label>
        <input
          type="number"
          name="price"
          value={offer.price}
          onChange={handleChange}
          required
          style={styles.input}
          min="0"
          step="0.01"
        />

        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    marginBottom: '1.5rem',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default EditOffer;
