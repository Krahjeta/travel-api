import React, { useState, useEffect } from 'react';
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
    availableSeats: '',
    image: '',
  });
  const [token, setToken] = useState('');
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/signin');
    }
  }, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/add-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offer),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add offer');
      }
      const result = await response.json();
      console.log('Offer added successfully:', result);
      alert('Offer added successfully!');
      navigate('/offers');
    } catch (err) {
      console.error('Failed to add offer:', err);
      alert(`Error adding offer: ${err.message}`);
    }
  };
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Add New Offer</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Destination City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Paris, London"
                value={offer.city}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Trip Type</label>
              <select name="type" value={offer.type} onChange={handleChange} style={styles.input}>
                <option value="One-way">One-way</option>
                <option value="Round-trip">Round-trip</option>
              </select>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Image Path</label>
            <input
              type="text"
              name="image"
              placeholder="/photos/Paris.avif or https://example.com/image.jpg"
              value={offer.image}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Departure</h3>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={offer.departureDate}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Time</label>
                <input
                  type="time"
                  name="departureTime"
                  value={offer.departureTime}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Landing</h3>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Date</label>
                <input
                  type="date"
                  name="landingDate"
                  value={offer.landingDate}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Time</label>
                <input
                  type="time"
                  name="landingTime"
                  value={offer.landingTime}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Price (€)</label>
              <input
                type="number"
                name="price"
                placeholder="299.99"
                value={offer.price}
                onChange={handleChange}
                required
                style={styles.input}
                min="0"
                step="0.01"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Available Seats</label>
              <input
                type="number"
                name="availableSeats"
                placeholder="50"
                value={offer.availableSeats}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
            </div>
          </div>
          <div style={styles.actions}>
            <button 
              type="button" 
              onClick={() => navigate('/offers')}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Add Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
    borderBottom: '2px solid #950606',
    paddingBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '500',
    color: '#555',
    fontSize: '0.9rem',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #ddd',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  section: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#950606',
    margin: '0 0 15px 0',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  submitButton: {
    flex: 2,
    padding: '12px',
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
export default AddOffers;