import React, { useState } from 'react';

const BookTicket = () => {
  const [tripType, setTripType] = useState('round');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Simulated login state (replace with real auth)
  const isLoggedIn = true;
  const userId = 1;

  // Helper to get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fix validation: require returnDate only for round trip
  const isFormValid = () =>
    from.trim() &&
    to.trim() &&
    departureDate &&
    travelers > 0 &&
    (tripType === 'oneway' || (tripType === 'round' && returnDate));

  const handleSearch = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setFlights([]);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8081/search-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departureCity: from.trim(),
          arrivalCity: to.trim(),
          flightDate: departureDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch flights.');

      if (data.length === 0) setMessage('No flights found.');
      else setFlights(data);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (flight) => {
    if (!isLoggedIn) {
      alert('Please log in to book a ticket.');
      return;
    }
    // Check if enough seats available for travelers
    if (travelers > flight.vendet_disponueshme) {
      alert(`Only ${flight.vendet_disponueshme} seats available for this flight.`);
      return;
    }
    setSelectedFlight(flight);
    setShowPaymentForm(true);
  };

  const handleReservation = async (paymentStatus) => {
    const token = getToken();
    if (!token) {
      alert('User token missing, please login again.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8081/reserve-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          userId,
          travelers,
          status: paymentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reservation failed');

      alert(`Reservation successful. Status: ${paymentStatus}`);
      setShowPaymentForm(false);
      setSelectedFlight(null);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.toggleContainer}>
          {['round', 'oneway'].map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              style={{
                ...styles.toggleButton,
                backgroundColor: tripType === type ? '#0072c6' : 'transparent',
                color: tripType === type ? '#fff' : '#0072c6',
              }}
            >
              {type === 'round' ? 'Round Trip' : 'One Way'}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={styles.grid}
        >
          <div style={styles.inputGroup}>
            <label>From</label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {tripType === 'round' && (
            <div style={styles.inputGroup}>
              <label>Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                style={styles.input}
                required
                min={departureDate} // Prevent return before departure
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label>Travelers</label>
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(e) =>
                setTravelers(Math.max(1, Number(e.target.value)))
              }
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Cabin Class</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              style={styles.input}
            >
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {message && <div style={styles.message}>{message}</div>}

        {flights.length > 0 && (
          <div style={styles.results}>
            <h3>Matching Flights</h3>
            {flights.map((flight) => {
              const canBook =
                isLoggedIn && travelers <= flight.vendet_disponueshme;
              return (
                <div key={flight.id} style={styles.flightCard}>
                  <p>
                    <strong>Airline:</strong> {flight.airline}
                  </p>
                  <p>
                    <strong>From:</strong> {flight.departureCity} (
                    {flight.departureAirport})
                  </p>
                  <p>
                    <strong>To:</strong> {flight.arrivalCity} (
                    {flight.arrivalAirport})
                  </p>
                  <p>
                    <strong>Departure Date:</strong> {flight.data_fluturimit}
                  </p>
                  <p>
                    <strong>Time:</strong> {flight.ora_fluturimit}
                  </p>
                  <p>
                    <strong>Available Seats:</strong> {flight.vendet_disponueshme}
                  </p>
                  <p>
                    <strong>Price:</strong> €{flight.qmimi}
                  </p>
                  <p>
                    <strong>Total:</strong> €
                    {(flight.qmimi * travelers).toFixed(2)}
                  </p>
                  {canBook ? (
                    <button
                      onClick={() => handleBookClick(flight)}
                      style={{ ...styles.searchButton, marginTop: '1rem' }}
                    >
                      Book Ticket
                    </button>
                  ) : (
                    <button
                      disabled
                      title={
                        !isLoggedIn
                          ? 'Login required'
                          : 'Not enough available seats'
                      }
                      style={{
                        ...styles.searchButton,
                        marginTop: '1rem',
                        backgroundColor: '#ccc',
                        cursor: 'not-allowed',
                      }}
                    >
                      Book Ticket
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showPaymentForm && selectedFlight && (
          <div style={styles.paymentModal}>
            <h3>Choose Payment Option</h3>
            <p>
              Total for {travelers} traveler(s): €
              {(selectedFlight.qmimi * travelers).toFixed(2)}
            </p>
            <button
              onClick={() => handleReservation('paid')}
              style={styles.searchButton}
            >
              Pay Now
            </button>
            <button
              onClick={() => handleReservation('not paid')}
              style={{ ...styles.searchButton, backgroundColor: '#6c757d' }}
            >
              Pay Later
            </button>
            <button
              onClick={() => {
                setShowPaymentForm(false);
                setSelectedFlight(null);
              }}
              style={{
                marginTop: '1rem',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', background: '#f4f6f8', padding: '2rem' },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: 10,
    maxWidth: 1000,
    margin: 'auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  toggleContainer: { display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' },
  toggleButton: {
    padding: '0.6rem 1.5rem',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '1px solid #0072c6',
    borderRadius: 5,
    marginRight: 10,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  input: {
    padding: '0.5rem',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  searchButton: {
    marginTop: '1rem',
    padding: '0.8rem 2rem',
    fontSize: '16px',
    backgroundColor: '#0072c6',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  message: { marginTop: '1rem', fontWeight: 'bold', color: '#d9534f' },
  results: { marginTop: '2rem' },
  flightCard: {
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: 8,
    boxShadow: '0 0 6px rgba(0,0,0,0.05)',
    marginBottom: '1rem',
  },
  paymentModal: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
};

export default BookTicket;
