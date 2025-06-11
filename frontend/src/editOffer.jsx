import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState({
    city: '',
    type: '',
    departureDate: '',
    departureTime: '',
    landingDate: '',
    landingTime: '',
    price: '',
    availableSeats: '',
    image: ''
  });

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/signin');
      return;
    }

    fetch(`http://localhost:8081/offers/${id}`, {
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    })
      .then(res => {
        console.log('Fetch response status:', res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Fetched offer data:', data);
        setOffer({
          city: data.city || '',
          type: data.type || '',
          departureDate: data.departureDate || '',
          departureTime: data.departureTime || '',
          landingDate: data.landingDate || '',
          landingTime: data.landingTime || '',
          price: data.price || '',
          availableSeats: data.availableSeats || '',
          image: data.image || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch offer:', err);
        alert(`Failed to load offer data: ${err.message}`);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setOffer(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting offer:', offer);
    console.log('Using token:', token);

    try {
      const response = await fetch(`http://localhost:8081/edit-offer/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(offer),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Offer updated successfully:', result);
      alert('Offer updated successfully');
      navigate('/offers');
    } catch (err) {
      console.error('Error updating offer:', err);
      alert(`Failed to update offer: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

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
        <select 
          name="type" 
          value={offer.type} 
          onChange={handleChange} 
          required
          style={styles.input}
        >
          <option value="">Select Type</option>
          <option value="One-way">One-way</option>
          <option value="Round-trip">Round-trip</option>
        </select>

        <label style={styles.label}>Departure Date:</label>
        <input
          type="date"
          name="departureDate"
          value={offer.departureDate}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Departure Time:</label>
        <input
          type="time"
          name="departureTime"
          value={offer.departureTime}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Landing Date:</label>
        <input
          type="date"
          name="landingDate"
          value={offer.landingDate}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Landing Time:</label>
        <input
          type="time"
          name="landingTime"
          value={offer.landingTime}
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

        <label style={styles.label}>Available Seats:</label>
        <input
          type="number"
          name="availableSeats"
          value={offer.availableSeats}
          onChange={handleChange}
          style={styles.input}
          min="0"
        />

        <label style={styles.label}>Image:</label>
        <input
          name="image"
          value={offer.image}
          onChange={handleChange}
          style={styles.input}
          placeholder="Image path or URL"
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