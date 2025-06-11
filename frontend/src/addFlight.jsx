import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddFlight = () => {
  const navigate = useNavigate();
  const [flight, setFlight] = useState({
    airline: '',
    departureCity: '',
    departureAirport: '',
    arrivalCity: '',
    arrivalAirport: '',
    flightDate: '',
    flightTime: '',
    price: '',
    availableSeats: '',
  });
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchAirlinesAndAirports(storedToken);
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const fetchAirlinesAndAirports = async (token) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [airlinesRes, airportsRes] = await Promise.all([
        fetch('http://localhost:8081/admin/airlines', { headers }),
        fetch('http://localhost:8081/admin/airports', { headers })
      ]);

      if (airlinesRes.ok) {
        const airlinesData = await airlinesRes.json();
        setAirlines(airlinesData);
      }

      if (airportsRes.ok) {
        const airportsData = await airportsRes.json();
        setAirports(airportsData);
      }
    } catch (err) {
      console.error('Failed to fetch airlines/airports:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlight(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/add-flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(flight),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add flight');
      }

      const result = await response.json();
      console.log('Flight added successfully:', result);
      alert('Flight added successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to add flight:', err);
      alert(`Error adding flight: ${err.message}`);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Add New Flight</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Airline</label>
              <select
                name="airline"
                value={flight.airline}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Airline</option>
                {airlines.map(airline => (
                  <option key={airline.id} value={airline.emri || airline.name}>
                    {airline.emri || airline.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Available Seats</label>
              <input
                type="number"
                name="availableSeats"
                placeholder="150"
                value={flight.availableSeats}
                onChange={handleChange}
                required
                style={styles.input}
                min="1"
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Departure</h3>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="departureCity"
                  placeholder="e.g. New York"
                  value={flight.departureCity}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Airport</label>
                <select
                  name="departureAirport"
                  value={flight.departureAirport}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Airport</option>
                  {airports.map(airport => (
                    <option key={airport.id} value={airport.emri || airport.name}>
                      {airport.emri || airport.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Arrival</h3>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="arrivalCity"
                  placeholder="e.g. Paris"
                  value={flight.arrivalCity}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Airport</label>
                <select
                  name="arrivalAirport"
                  value={flight.arrivalAirport}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Airport</option>
                  {airports.map(airport => (
                    <option key={airport.id} value={airport.emri || airport.name}>
                      {airport.emri || airport.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Flight Details</h3>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Flight Date</label>
                <input
                  type="date"
                  name="flightDate"
                  value={flight.flightDate}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Flight Time</label>
                <input
                  type="time"
                  name="flightTime"
                  value={flight.flightTime}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price (€)</label>
            <input
              type="number"
              name="price"
              placeholder="299.99"
              value={flight.price}
              onChange={handleChange}
              required
              style={styles.input}
              min="0"
              step="0.01"
            />
          </div>

          <div style={styles.actions}>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Add Flight
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

export default AddFlight;