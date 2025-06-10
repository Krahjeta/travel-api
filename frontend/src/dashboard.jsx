import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [countries, setCountries] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        navigate('/signin');
        return;
      }
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
          alert('Access denied. Admin only.');
          navigate('/');
          return;
        }
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        // Fetch all data
        const [usersRes, offersRes, reservationsRes, flightsRes, airlinesRes, airportsRes, countriesRes] = await Promise.all([
          fetch('http://localhost:8081/admin/users', { headers }),
          fetch('http://localhost:8081/offers', { headers }),
          fetch('http://localhost:8081/admin/reservations', { headers }),
          fetch('http://localhost:8081/admin/flights', { headers }),
          fetch('http://localhost:8081/admin/airlines', { headers }),
          fetch('http://localhost:8081/admin/airports', { headers }),
          fetch('http://localhost:8081/admin/countries', { headers })
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (offersRes.ok) setOffers(await offersRes.json());
        if (reservationsRes.ok) setReservations(await reservationsRes.json());
        if (flightsRes.ok) setFlights(await flightsRes.json());
        if (airlinesRes.ok) setAirlines(await airlinesRes.json());
        if (airportsRes.ok) setAirports(await airportsRes.json());
        if (countriesRes.ok) setCountries(await countriesRes.json());
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchAllData();
  }, [navigate]);
  // Delete functions
  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      const response = await fetch(`http://localhost:8081/admin/delete-${type}/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        alert(`${type} deleted successfully`);
        // Refresh data
        window.location.reload();
      } else {
        alert(`Failed to delete ${type}`);
      }
    } catch (err) {
      alert(`Error deleting ${type}: ${err.message}`);
    }
  };
  // Edit functions (placeholder - you'll need to implement edit modals/forms)
const handleEdit = (type, item) => {
  // Navigate to edit page with the item data
  navigate(`/edit-admin/${type}/${item.id}`, { state: { item } });
};
  if (loading) return <div style={styles.container}>Loading dashboard...</div>;
  if (error) return <div style={styles.container}>Error: {error}</div>;
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>
      {/* Users Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Users ({users.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={{...styles.td, fontWeight: user.role === 'admin' ? 'bold' : 'normal', color: user.role === 'admin' ? '#950606' : 'inherit'}}>
                    {user.role}
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('user', user)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('user', user.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Offers Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Offers ({offers.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Departure</th>
                <th style={styles.th}>Landing</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Available Seats</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id}>
                  <td style={styles.td}>{offer.id}</td>
                  <td style={styles.td}>{offer.city}</td>
                  <td style={styles.td}>{offer.type}</td>
                  <td style={styles.td}>{offer.departureDate} {offer.departureTime}</td>
                  <td style={styles.td}>{offer.landingDate} {offer.landingTime}</td>
                  <td style={styles.td}>€{offer.price}</td>
                  <td style={styles.td}>{offer.availableSeats}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('offer', offer)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('offer', offer.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Reservations Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Reservations ({reservations.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Offer/Flight</th>
                <th style={styles.th}>Seats</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td style={styles.td}>{reservation.id}</td>
                  <td style={styles.td}>{reservation.userName || reservation.userEmail}</td>
                  <td style={styles.td}>
                    {reservation.offerCity || reservation.flightRoute || 'N/A'}
                  </td>
                  <td style={styles.td}>{reservation.numSeats}</td>
                  <td style={{...styles.td, color: reservation.paid ? 'green' : 'red', fontWeight: 'bold'}}>
                    {reservation.paid ? 'Paid' : 'Unpaid'}
                  </td>
                  <td style={styles.td}>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('reservation', reservation)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('reservation', reservation.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Flights Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Flights ({flights.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Airline</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Seats</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.id}>
                  <td style={styles.td}>{flight.id}</td>
                  <td style={styles.td}>{flight.airline || flight.airlineName}</td>
                  <td style={styles.td}>{flight.departureCity} ({flight.departureAirport})</td>
                  <td style={styles.td}>{flight.arrivalCity} ({flight.arrivalAirport})</td>
                  <td style={styles.td}>{flight.data_fluturimit || flight.flightDate}</td>
                  <td style={styles.td}>{flight.ora_fluturimit || flight.flightTime}</td>
                  <td style={styles.td}>€{flight.qmimi || flight.price}</td>
                  <td style={styles.td}>{flight.vendet_disponueshme || flight.availableSeats}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('flight', flight)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('flight', flight.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Airlines Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Airlines ({airlines.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map(airline => (
                <tr key={airline.id}>
                  <td style={styles.td}>{airline.id}</td>
                  <td style={styles.td}>{airline.emri || airline.name}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('airline', airline)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('airline', airline.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Airports Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Airports ({airports.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Country</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {airports.map(airport => (
                <tr key={airport.id}>
                  <td style={styles.td}>{airport.id}</td>
                  <td style={styles.td}>{airport.emri || airport.name}</td>
                  <td style={styles.td}>{airport.qyteti || airport.city}</td>
                  <td style={styles.td}>{airport.shteti_name || 'N/A'}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('airport', airport)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('airport', airport.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Countries Table */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Countries ({countries.length})</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map(country => (
                <tr key={country.id}>
                  <td style={styles.td}>{country.id}</td>
                  <td style={styles.td}>{country.emri || country.name}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEdit('country', country)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('country', country.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    color: '#950606',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  },
  section: {
    marginBottom: '3rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  sectionTitle: {
    color: '#950606',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    borderBottom: '2px solid #950606',
    paddingBottom: '0.5rem',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#950606',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '12px',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
export default Dashboard;