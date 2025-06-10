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

  const PaymentForm = () => (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '90%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        position: 'relative',
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Payment Details</h3>
        <form onSubmit={handlePaymentSubmit}>
          {['cardNumber', 'expirationDate', 'cvv'].map((field) => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                {field === 'cardNumber'
                  ? 'Card Number'
                  : field === 'expirationDate'
                  ? 'Expiration Date (MM/YY)'
                  : 'CVV'}
              </label>
              <input
                name={field}
                value={paymentInfo[field]}
                onChange={handlePaymentChange}
                maxLength={field === 'cardNumber' ? 16 : field === 'cvv' ? 3 : undefined}
                placeholder={field === 'expirationDate' ? 'MM/YY' : ''}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
                type={field === 'cardNumber' || field === 'cvv' ? 'tel' : 'text'}
                inputMode={field === 'cardNumber' || field === 'cvv' ? 'numeric' : undefined}
              />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="submit"
              style={{
                padding: '10px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '2rem',
  };

  const thtdStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
  };

  const renderTable = (data, isFlight) => (
    <table style={tableStyle}>
      <thead>
        <tr>
          {isFlight ? (
            <>
              <th style={thtdStyle}>City</th>
              <th style={thtdStyle}>Airline</th>
              <th style={thtdStyle}>From</th>
              <th style={thtdStyle}>To</th>
              <th style={thtdStyle}>Date</th>
              <th style={thtdStyle}>Time</th>
              <th style={thtdStyle}>Seats</th>
              <th style={thtdStyle}>Status</th>
              <th style={thtdStyle}>Actions</th>
            </>
          ) : (
            <>
              <th style={thtdStyle}>City</th>
              <th style={thtdStyle}>Date</th>
              <th style={thtdStyle}>Time</th>
              <th style={thtdStyle}>Seats</th>
              <th style={thtdStyle}>Status</th>
              <th style={thtdStyle}>Actions</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.reservationId}>
            <td style={thtdStyle}>{isFlight ? r.arrivalCity : r.offerCity}</td>
            {isFlight && (
              <>
                <td style={thtdStyle}>{r.airlineName}</td>
                <td style={thtdStyle}>{r.departureAirport}</td>
                <td style={thtdStyle}>{r.arrivalAirport}</td>
              </>
            )}
            <td style={thtdStyle}>{isFlight ? r.flightDate : r.offerDepartureDate}</td>
            <td style={thtdStyle}>{isFlight ? r.flightTime : r.offerDepartureTime}</td>
            <td style={thtdStyle}>{r.numSeats}</td>
            <td style={thtdStyle}>
              <span style={{ color: r.paid ? 'green' : 'red', fontWeight: 'bold' }}>
                {r.paid ? 'Paid' : 'Not Paid'}
              </span>
            </td>
            <td style={thtdStyle}>
              {!r.paid && (
                <button
                  onClick={() => handleShowPaymentForm(r.reservationId)}
                  disabled={payingId === r.reservationId}
                  style={{ marginRight: '8px' }}
                >
                  Pay Now
                </button>
              )}
              <button
                onClick={() => cancelReservation(r.reservationId, r.paid)}
                disabled={r.paid}
                style={{
                  backgroundColor: r.paid ? 'gray' : 'red',
                  color: 'white',
                  cursor: r.paid ? 'not-allowed' : 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                }}
              >
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const flightReservations = reservations.filter(r => r.airlineName);
  const offerReservations = reservations.filter(r => !r.airlineName);

  if (loading) return <p>Loading your reservations...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Flight Reservations</h2>
      {flightReservations.length > 0
        ? renderTable(flightReservations, true)
        : <p>No flight reservations.</p>}

      <h2>Offer Reservations</h2>
      {offerReservations.length > 0
        ? renderTable(offerReservations, false)
        : <p>No offer reservations.</p>}

      {showPaymentForm && <PaymentForm />}
    </div>
  );
};

export default MyTicket;
