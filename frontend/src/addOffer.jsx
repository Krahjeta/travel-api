import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddOffers = () => {
  const navigate = useNavigate();
  const [offer, setOffer] = useState({
    city: '',
    type: 'One-way',
    departureDate: '',
    departureTime: '',
    landingDate: '',
    landingTime: '',
    price: '',
    imagePath: '',  // New field for image path
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8081/add-offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    })
      .then(res => res.json())
      .then(() => {
        alert('Offer added successfully!');
        navigate('/offers');
      })
      .catch(err => {
        console.error('Failed to add offer:', err);
        alert('Error adding offer.');
      });
  };

  return (
    <div style={styles.container}>
      <h2>Add New Offer</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={offer.city}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="imagePath"
          placeholder="Image Path (e.g. /photos/Paris.avif or https://example.com/image.jpg)"
          value={offer.imagePath}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select name="type" value={offer.type} onChange={handleChange} style={styles.input}>
          <option value="One-way">One-way</option>
          <option value="Round-trip">Round-trip</option>
        </select>
        <input
          type="date"
          name="departureDate"
          value={offer.departureDate}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="time"
          name="departureTime"
          value={offer.departureTime}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="date"
          name="landingDate"
          value={offer.landingDate}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="time"
          name="landingTime"
          value={offer.landingTime}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (€)"
          value={offer.price}
          onChange={handleChange}
          required
          style={styles.input}
          min="0"
          step="0.01"
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.5rem',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default AddOffers;

