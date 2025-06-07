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
  const [stage, setStage] = useState('selection'); // 'selection', 'paymentOptions', 'payment'
  const [paymentInfo, setPaymentInfo] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvv: '',
    expirationDate: '',
  });

  // Replace this logic with your real auth state & token getter
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
    if (travelers > flight.vendet_disponueshme) {
      alert(`Only ${flight.vendet_disponueshme} seats available for this flight.`);
      return;
    }
    setSelectedFlight(flight);
    setStage('paymentOptions');  // Show payment options modal
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

    await handleReserveFlight(true);  // paid = true
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
      <div style={styles.card}>
        {/* Trip Type Toggle */}
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

        {/* Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={styles.grid}
        >
          <div style={styles.inputGroup}>
            <label>From</label>
            <input value={from} onChange={(e) => setFrom(e.target.value)} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label>To</label>
            <input value={to} onChange={(e) => setTo(e.target.value)} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label>Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              style={styles.input}
            />
          </div>

          {tripType === 'round' && (
            <div style={styles.inputGroup}>
              <label>Return Date</label>
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
            <label>Travelers</label>
            <input
              type="number"
              min={1}
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Cabin Class</label>
            <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} style={styles.input}>
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <button type="submit" disabled={loading || !isFormValid()} style={styles.searchButton}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {message && <div style={styles.message}>{message}</div>}

        {/* Flight Results */}
        {flights.length > 0 && (
          <div style={styles.results}>
            <h3>Matching Flights</h3>
            {flights.map((flight) => (
              <div key={flight.id} style={styles.flightCard}>
                <p><strong>Airline:</strong> {flight.airline}</p>
                <p><strong>From:</strong> {flight.departureCity} ({flight.departureAirport})</p>
                <p><strong>To:</strong> {flight.arrivalCity} ({flight.arrivalAirport})</p>
                <p><strong>Date:</strong> {flight.data_fluturimit}</p>
                <p><strong>Time:</strong> {flight.ora_fluturimit}</p>
                <p><strong>Available Seats:</strong> {flight.vendet_disponueshme}</p>
                <p><strong>Price:</strong> €{flight.qmimi}</p>
                <p><strong>Total:</strong> €{(flight.qmimi * travelers).toFixed(2)}</p>
                <button
                  onClick={() => handleBookClick(flight)}
                  disabled={!isLoggedIn || travelers > flight.vendet_disponueshme}
                  style={{
                    ...styles.searchButton,
                    marginTop: '1rem',
                    backgroundColor: !isLoggedIn || travelers > flight.vendet_disponueshme ? '#ccc' : '#0072c6',
                    cursor: !isLoggedIn || travelers > flight.vendet_disponueshme ? 'not-allowed' : 'pointer',
                  }}
                >
                  Book Ticket
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Payment Options */}
        {selectedFlight && stage === 'paymentOptions' && (
          <div style={styles.paymentModal}>
            <h3>Choose Payment Option</h3>
            <p>
              You selected flight {selectedFlight.id} from {selectedFlight.departureCity} to {selectedFlight.arrivalCity}.
            </p>
            <p>Seats to book: {travelers}</p>
            <p>Total price: €{(selectedFlight.qmimi * travelers).toFixed(2)}</p>

            <button onClick={handlePayNow} style={styles.paymentButton}>
              Pay Now
            </button>
            <button
              onClick={() => handleReserveFlight(false)}
              style={{ ...styles.paymentButton, backgroundColor: '#ccc', color: '#333' }}
            >
              Pay Later
            </button>
            <button
              onClick={() => {
                setSelectedFlight(null);
                setStage('selection');
              }}
              style={{ ...styles.paymentButton, backgroundColor: 'red' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Payment Form */}
        {selectedFlight && stage === 'payment' && (
          <div style={styles.paymentModal}>
            <h3>Payment Details</h3>
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                name="firstName"
                placeholder="First Name"
                value={paymentInfo.firstName}
                onChange={handlePaymentChange}
                style={styles.input}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={paymentInfo.lastName}
                onChange={handlePaymentChange}
                style={styles.input}
                required
              />
              <input
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                style={styles.input}
                maxLength={16}
                required
              />
              <input
                name="cvv"
                placeholder="CVV"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                style={styles.input}
                maxLength={3}
                required
              />
              <input
                name="expirationDate"
                type="month"
                placeholder="Expiration Date"
                value={paymentInfo.expirationDate}
                onChange={handlePaymentChange}
                style={styles.input}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button type="submit" style={styles.paymentButton}>
                  Pay Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStage('paymentOptions');
                  }}
                  style={{ ...styles.paymentButton, backgroundColor: '#ccc', color: '#333' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFlight(null);
                    setStage('selection');
                  }}
                  style={{ ...styles.paymentButton, backgroundColor: 'red' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#ebf5fb',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 0 10px #ddd',
    maxWidth: 900,
    width: '100%',
    padding: '1.5rem',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    gap: '1rem',
  },
  toggleButton: {
    borderRadius: 5,
    border: '1px solid #0072c6',
    padding: '0.5rem 1.25rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.4rem 0.5rem',
    fontSize: '1rem',
    borderRadius: 5,
    border: '1px solid #ccc',
    marginTop: '0.25rem',
  },
  searchButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0072c6',
    border: 'none',
    borderRadius: 5,
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  message: {
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  results: {
    marginTop: '2rem',
  },
  flightCard: {
    padding: '1rem',
    borderBottom: '1px solid #ddd',
  },
  paymentModal: {
    position: 'fixed',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '2rem',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    borderRadius: 10,
    zIndex: 1000,
    maxWidth: 400,
    width: '90%',
  },
  paymentButton: {
    backgroundColor: '#0072c6',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '0.5rem',
    width: '100%',
  },
};

export default BookTicket;
