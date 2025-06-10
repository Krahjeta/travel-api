import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function EditAdminDashboard() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/signin');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    // Set initial form data from navigation state
    if (location.state?.item) {
      setFormData(location.state.item);
    }
  }, [navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(`http://localhost:8081/admin/edit-${type}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`${type} updated successfully`);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Failed to update ${type}: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error updating ${type}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderForm = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role:</label>
              <select
                value={formData.role || 'user'}
                onChange={(e) => handleInputChange('role', e.target.value)}
                style={styles.input}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        );

      case 'offer':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>City:</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type:</label>
              <input
                type="text"
                value={formData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Departure Date:</label>
              <input
                type="date"
                value={formData.departureDate || ''}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Departure Time:</label>
              <input
                type="time"
                value={formData.departureTime || ''}
                onChange={(e) => handleInputChange('departureTime', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Landing Date:</label>
              <input
                type="date"
                value={formData.landingDate || ''}
                onChange={(e) => handleInputChange('landingDate', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Landing Time:</label>
              <input
                type="time"
                value={formData.landingTime || ''}
                onChange={(e) => handleInputChange('landingTime', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (€):</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Available Seats:</label>
              <input
                type="number"
                value={formData.availableSeats || ''}
                onChange={(e) => handleInputChange('availableSeats', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Image URL:</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => handleInputChange('image', e.target.value)}
                style={styles.input}
              />
            </div>
          </>
        );

      case 'airline':
        return (
          <div style={styles.formGroup}>
            <label style={styles.label}>Airline Name:</label>
            <input
              type="text"
              value={formData.emri || formData.name || ''}
              onChange={(e) => handleInputChange('emri', e.target.value)}
              style={styles.input}
              required
            />
          </div>
        );

      case 'country':
        return (
          <div style={styles.formGroup}>
            <label style={styles.label}>Country Name:</label>
            <input
              type="text"
              value={formData.emri || formData.name || ''}
              onChange={(e) => handleInputChange('emri', e.target.value)}
              style={styles.input}
              required
            />
          </div>
        );

      case 'reservation':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Seats:</label>
              <input
                type="number"
                value={formData.numSeats || ''}
                onChange={(e) => handleInputChange('numSeats', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Status:</label>
              <select
                value={formData.paid ? '1' : '0'}
                onChange={(e) => handleInputChange('paid', e.target.value === '1')}
                style={styles.input}
              >
                <option value="0">Unpaid</option>
                <option value="1">Paid</option>
              </select>
            </div>
          </>
        );

      case 'airport':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Airport Name:</label>
              <input
                type="text"
                value={formData.emri || formData.name || ''}
                onChange={(e) => handleInputChange('emri', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>City:</label>
              <input
                type="text"
                value={formData.qyteti || formData.city || ''}
                onChange={(e) => handleInputChange('qyteti', e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </>
        );

      case 'flight':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Flight Date:</label>
              <input
                type="date"
                value={formData.data_fluturimit || formData.flightDate || ''}
                onChange={(e) => handleInputChange('data_fluturimit', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Flight Time:</label>
              <input
                type="time"
                value={formData.ora_fluturimit || formData.flightTime || ''}
                onChange={(e) => handleInputChange('ora_fluturimit', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (€):</label>
              <input
                type="number"
                value={formData.qmimi || formData.price || ''}
                onChange={(e) => handleInputChange('qmimi', e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Available Seats:</label>
              <input
                type="number"
                value={formData.vendet_disponueshme || formData.availableSeats || ''}
                onChange={(e) => handleInputChange('vendet_disponueshme', e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </>
        );

      default:
        return <div>Unknown edit type</div>;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      
      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          
          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              style={styles.saveBtn}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  title: {
    color: '#950606',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  saveBtn: {
    backgroundColor: '#950606',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1,
  },
};

export default EditAdminDashboard;