import React, { useEffect, useState } from 'react';
const MyTicket = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id || !token) {
        setError('User or token missing.');
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8081/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setReservations(data.map(r => ({ ...r, paid: r.paid === 1 })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user, token]);
  const cancelReservation = async (id, paid) => {
    if (paid) return alert("Can't cancel a paid reservation.");
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch('http://localhost:8081/cancel-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId: id }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Cancel failed');
      alert('Reservation cancelled.');
      setReservations(prev => prev.filter(r => r.reservationId !== id));
    } catch (err) {
      alert(err.message);
    }
  };
  const handleShowPaymentForm = (id) => {
    setSelectedReservationId(id);
    setShowPaymentForm(true);
  };
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPayingId(selectedReservationId);
    try {
      const res = await fetch('http://localhost:8081/pay-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId: selectedReservationId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Payment failed');
      alert('Payment successful!');
      setReservations(prev =>
        prev.map(r =>
          r.reservationId === selectedReservationId ? { ...r, paid: true } : r
        )
      );
      setShowPaymentForm(false);
      setPaymentInfo({ cardNumber: '', expirationDate: '', cvv: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setPayingId(null);
    }
  };
  const flightReservations = reservations.filter(r => r.airlineName);
  const offerReservations = reservations.filter(r => !r.airlineName);
  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  return (
    <div style={styles.wrapper}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.title}>My Reservations</h1>
        <p style={styles.subtitle}>Manage your flights and travel bookings</p>
      </div>
      <div style={styles.container}>
        {/* Flight Reservations */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Flight Reservations</h2>
          {flightReservations.length > 0 ? (
            flightReservations.map(reservation => (
              <div key={reservation.reservationId} style={styles.card}>
                <div style={styles.cardHeader}>
                  <strong>{reservation.airlineName}</strong>
                  <span style={{
                    ...styles.status,
                    backgroundColor: reservation.paid ? '#d4edda' : '#f8d7da',
                    color: reservation.paid ? '#155724' : '#721c24',
                  }}>
                    {reservation.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div style={styles.route}>
                  {reservation.departureCity} → {reservation.arrivalCity}
                </div>
                <div style={styles.details}>
                  <span>Date: {reservation.flightDate}</span>
                  <span>Time: {reservation.flightTime}</span>
                  <span>Seats: {reservation.numSeats}</span>
                </div>
                <div style={styles.actions}>
                  {!reservation.paid && (
                    <button
                      onClick={() => handleShowPaymentForm(reservation.reservationId)}
                      style={styles.payBtn}
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    onClick={() => cancelReservation(reservation.reservationId, reservation.paid)}
                    disabled={reservation.paid}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No flight reservations found.</p>
          )}
        </div>
        {/* Offer Reservations */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Offer Reservations</h2>
          {offerReservations.length > 0 ? (
            offerReservations.map(reservation => (
              <div key={reservation.reservationId} style={styles.card}>
                <div style={styles.cardHeader}>
                  <strong>Special Offer</strong>
                  <span style={{
                    ...styles.status,
                    backgroundColor: reservation.paid ? '#d4edda' : '#f8d7da',
                    color: reservation.paid ? '#155724' : '#721c24',
                  }}>
                    {reservation.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div style={styles.route}>
                  Destination: {reservation.offerCity}
                </div>
                <div style={styles.details}>
                  <span>Date: {reservation.offerDepartureDate}</span>
                  <span>Time: {reservation.offerDepartureTime}</span>
                  <span>Seats: {reservation.numSeats}</span>
                </div>
                <div style={styles.actions}>
                  {!reservation.paid && (
                    <button
                      onClick={() => handleShowPaymentForm(reservation.reservationId)}
                      style={styles.payBtn}
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    onClick={() => cancelReservation(reservation.reservationId, reservation.paid)}
                    disabled={reservation.paid}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No offer reservations found.</p>
          )}
        </div>
      </div>
      {/* Payment Modal */}
      {showPaymentForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Payment Details</h3>
            <form onSubmit={handlePaymentSubmit}>
              <input
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                style={styles.input}
                required
              />
              <div style={styles.row}>
                <input
                  name="expirationDate"
                  placeholder="MM/YY"
                  value={paymentInfo.expirationDate}
                  onChange={handlePaymentChange}
                  style={styles.input}
                  required
                />
                <input
                  name="cvv"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.modalActions}>
                <button type="submit" style={styles.payBtn}>
                  {payingId ? 'Processing...' : 'Pay'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  hero: {
    background: 'linear-gradient(135deg, #950606 0%, #650404 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: 0,
    opacity: 0.9,
  },
  container: {
    maxWidth: '800px',
    margin: '-30px auto 0',
    padding: '0 20px',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #950606',
    paddingBottom: '10px',
  },
  card: {
    border: '1px solid #e9ecef',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#fafafa',
    transition: 'transform 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  status: {
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  route: {
    fontSize: '1.2rem',
    marginBottom: '15px',
    color: '#333',
    fontWeight: '600',
  },
  details: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    fontSize: '0.9rem',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  payBtn: {
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '1.2rem',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '100px',
    color: '#dc3545',
    fontSize: '1.1rem',
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
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '350px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
  },
  row: {
    display: 'flex',
    gap: '10px',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'center',
  },
};
export default MyTicket;