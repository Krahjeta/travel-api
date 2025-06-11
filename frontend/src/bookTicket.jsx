import React, { useState } from 'react';
import airplaneImage from './photos/airplane.jpg';
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
  const [stage, setStage] = useState('selection');
  const [paymentInfo, setPaymentInfo] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvv: '',
    expirationDate: '',
  });
  const getToken = () => localStorage.getItem('token');
  const isLoggedIn = Boolean(getToken());
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
      const token = getToken();
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('http://localhost:8081/search-flights', {
        method: 'POST',
        headers: headers,
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
    if (travelers > flight.vendet_disponueshme) {
      alert(`Only ${flight.vendet_disponueshme} seats available for this flight.`);
      return;
    }
    setSelectedFlight(flight);
    setStage('paymentOptions');
  };
  const handlePayNow = () => {
    if (!selectedFlight) {
      alert('No flight selected. Please select a flight first.');
      setStage('selection');
      return;
    }
    setStage('payment');
  };
  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlight) {
      alert('No flight selected. Please select a flight first.');
      setStage('selection');
      return;
    }
    const { firstName, lastName, cardNumber, cvv, expirationDate } = paymentInfo;
    if (!firstName || !lastName || !cardNumber || !cvv || !expirationDate) {
      alert('Please fill in all payment details.');
      return;
    }
    await handleReserveFlight(true);
  };
  const handleReserveFlight = async (paid) => {
    if (!selectedFlight) {
      alert('No flight selected.');
      return;
    }
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
          numSeats: travelers,
          paid: paid ? 1 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reservation failed');
      alert(`Reservation successful. Status: ${paid ? 'paid' : 'not paid'}`);
      setSelectedFlight(null);
      setStage('selection');
      setPaymentInfo({
        firstName: '',
        lastName: '',
        cardNumber: '',
        cvv: '',
        expirationDate: '',
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  return (
    <div style={styles.wrapper}>
{/* Hero Section */}
<div style={styles.hero}>
  <div style={styles.heroOverlay}>
    <h1 style={styles.heroTitle}>✈️ Book Your Flight</h1>
    <p style={styles.heroSubtitle}>Find and book the perfect flight for your next adventure</p>
  </div>
</div>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Trip Type Toggle */}
          <div style={styles.toggleContainer}>
            {['round', 'oneway'].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                style={{
                  ...styles.toggleButton,
                  backgroundColor: tripType === type ? '#950606' : 'transparent',
                  color: tripType === type ? '#fff' : '#950606',
                  borderColor: '#950606',
                }}
              >
                {type === 'round' ? '🔄 Round Trip' : '➡️ One Way'}
              </button>
            ))}
          </div>
          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={styles.grid}
          >
            <div style={styles.inputGroup}>
              <label style={styles.label}>🛫 From</label>
              <input 
                value={from} 
                onChange={(e) => setFrom(e.target.value)} 
                style={styles.input}
                placeholder="Enter departure city"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>🛬 To</label>
              <input 
                value={to} 
                onChange={(e) => setTo(e.target.value)} 
                style={styles.input}
                placeholder="Enter destination city"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>📅 Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={styles.input}
              />
            </div>
            {tripType === 'round' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>📅 Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  min={departureDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            )}
            <div style={styles.inputGroup}>
              <label style={styles.label}>👥 Travelers</label>
              <input
                type="number"
                min={1}
                value={travelers}
                onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>🎭 Cabin Class</label>
              <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} style={styles.input}>
                <option>Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
              <button type="submit" disabled={loading || !isFormValid()} style={styles.searchButton}>
                {loading ? '🔍 Searching...' : '🔍 Search Flights'}
              </button>
            </div>
          </form>
          {message && <div style={styles.message}>{message}</div>}
          {/* Flight Results */}
          {flights.length > 0 && (
            <div style={styles.results}>
              <h3 style={styles.resultsTitle}>✈️ Available Flights</h3>
              <div style={styles.flightGrid}>
                {flights.map((flight) => (
                  <div key={flight.id} style={styles.flightCard}>
                    <div style={styles.flightHeader}>
                      <h4 style={styles.airlineName}>{flight.airline}</h4>
                      <div style={styles.price}>€{flight.qmimi}</div>
                    </div>
                    
                    <div style={styles.flightRoute}>
                      <div style={styles.routePoint}>
                        <div style={styles.cityName}>{flight.departureCity}</div>
                        <div style={styles.airportName}>{flight.departureAirport}</div>
                      </div>
                      <div style={styles.routeArrow}>✈️</div>
                      <div style={styles.routePoint}>
                        <div style={styles.cityName}>{flight.arrivalCity}</div>
                        <div style={styles.airportName}>{flight.arrivalAirport}</div>
                      </div>
                    </div>
                    <div style={styles.flightDetails}>
                      <div style={styles.detailItem}>
                        <span>📅 Date:</span> {flight.data_fluturimit}
                      </div>
                      <div style={styles.detailItem}>
                        <span>🕐 Time:</span> {flight.ora_fluturimit}
                      </div>
                      <div style={styles.detailItem}>
                        <span>💺 Available:</span> {flight.vendet_disponueshme} seats
                      </div>
                    </div>
                    <div style={styles.totalPrice}>
                      Total for {travelers} traveler{travelers > 1 ? 's' : ''}: 
                      <strong> €{(flight.qmimi * travelers).toFixed(2)}</strong>
                    </div>
                    <button
                      onClick={() => handleBookClick(flight)}
                      disabled={!isLoggedIn || travelers > flight.vendet_disponueshme}
                      style={{
                        ...styles.bookButton,
                        backgroundColor: !isLoggedIn || travelers > flight.vendet_disponueshme ? '#ccc' : '#950606',
                        cursor: !isLoggedIn || travelers > flight.vendet_disponueshme ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {!isLoggedIn ? '🔒 Login to Book' : '🎫 Book This Flight'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Payment Options Modal */}
          {selectedFlight && stage === 'paymentOptions' && (
            <div style={styles.modal}>
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>💳 Choose Payment Option</h3>
                <div style={styles.selectedFlightInfo}>
                  <p><strong>✈️ Flight:</strong> {selectedFlight.airline}</p>
                  <p><strong>🛫 Route:</strong> {selectedFlight.departureCity} → {selectedFlight.arrivalCity}</p>
                  <p><strong>👥 Travelers:</strong> {travelers}</p>
                  <p><strong>💰 Total:</strong> €{(selectedFlight.qmimi * travelers).toFixed(2)}</p>
                </div>
                <div style={styles.modalButtons}>
                  <button onClick={handlePayNow} style={styles.payNowButton}>
                    💳 Pay Now
                  </button>
                  <button
                    onClick={() => handleReserveFlight(false)}
                    style={styles.payLaterButton}
                  >
                    📝 Reserve & Pay Later
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFlight(null);
                      setStage('selection');
                    }}
                    style={styles.cancelButton}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Payment Form Modal */}
          {selectedFlight && stage === 'payment' && (
            <div style={styles.modal}>
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>💳 Payment Details</h3>
                <form onSubmit={handlePaymentSubmit} style={styles.paymentForm}>
                  <div style={styles.nameRow}>
                    <input
                      name="firstName"
                      placeholder="First Name"
                      value={paymentInfo.firstName}
                      onChange={handlePaymentChange}
                      style={styles.paymentInput}
                      required
                    />
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      value={paymentInfo.lastName}
                      onChange={handlePaymentChange}
                      style={styles.paymentInput}
                      required
                    />
                  </div>
                  <input
                    name="cardNumber"
                    placeholder="💳 Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    style={styles.paymentInput}
                    maxLength={16}
                    required
                  />
                  <div style={styles.cardRow}>
                    <input
                      name="cvv"
                      placeholder="🔒 CVV"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      style={styles.paymentInput}
                      maxLength={3}
                      required
                    />
                    <input
                      name="expirationDate"
                      type="month"
                      placeholder="📅 Expiry"
                      value={paymentInfo.expirationDate}
                      onChange={handlePaymentChange}
                      style={styles.paymentInput}
                      required
                    />
                  </div>
                  <div style={styles.modalButtons}>
                    <button type="submit" style={styles.payNowButton}>
                      💳 Complete Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage('paymentOptions')}
                      style={styles.backButton}
                    >
                      ⬅️ Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  hero: {
    backgroundImage: `url(${airplaneImage})`,
    backgroundSize: '100%', 
    backgroundPosition: 'center top', 
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#f0f8ff', 
    color: 'white',
    padding: '40px 20px', 
    textAlign: 'center',
    position: 'relative',
    minHeight: '300px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '30px', 
    borderRadius: '15px',
    backdropFilter: 'blur(5px)',
  },
  heroTitle: {
    fontSize: '2.5rem', 
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  heroSubtitle: {
    fontSize: '1.1rem', 
    margin: 0,
    opacity: 0.95,
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  container: {
    maxWidth: '1200px',
    margin: '-60px auto 0', 
    padding: '0 20px',
    position: 'relative',
    zIndex: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)', 
    position: 'relative',
  },
  toggleContainer: {
    display: 'flex',
    marginBottom: '30px',
    gap: '10px',
    justifyContent: 'center',
  },
  toggleButton: {
    padding: '12px 24px',
    border: '2px solid',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  searchButton: {
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '25px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(149, 6, 6, 0.3)',
  },
  message: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    margin: '20px 0',
    color: '#666',
  },
  results: {
    marginTop: '40px',
  },
  resultsTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  flightGrid: {
    display: 'grid',
    gap: '20px',
  },
  flightCard: {
    border: '2px solid #e1e5e9',
    borderRadius: '15px',
    padding: '25px',
    backgroundColor: '#fafbfc',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  flightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  airlineName: {
    margin: 0,
    color: '#950606',
    fontSize: '1.3rem',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#950606',
  },
  flightRoute: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '10px',
  },
  routePoint: {
    textAlign: 'center',
    flex: 1,
  },
  cityName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  airportName: {
    fontSize: '0.9rem',
    color: '#666',
  },
  routeArrow: {
    fontSize: '1.5rem',
    margin: '0 20px',
  },
  flightDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginBottom: '15px',
  },
  detailItem: {
    fontSize: '14px',
    color: '#666',
  },
  totalPrice: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    textAlign: 'center',
  },
  bookButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    transition: 'all 0.3s ease',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  selectedFlightInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  payNowButton: {
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  payLaterButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  paymentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  cardRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  paymentInput: {
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
  },
};
export default BookTicket;