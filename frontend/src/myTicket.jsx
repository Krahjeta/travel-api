import React, { useEffect, useState } from 'react';

const MyTicket = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchReservations = () => {
    if (!user || !user.id) {
      console.log('No user or user.id');
      setReservations([]);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('User token missing, please login again.');
      setReservations([]);
      return;
    }

    const url = `http://localhost:8081/reservations`;
    console.log('Fetching reservations from:', url);

    setLoading(true);
    setError(null);

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch reservations: ${res.status} ${res.statusText} - ${errorText}`);
        }
        return res.json();
      })
      .then(data => {
        // Normalize 'paid' field to boolean
        const normalized = data.map(r => ({
          ...r,
          paid: r.paid == 1,  // convert 1/0 to true/false
        }));
        console.log('Reservations data:', normalized);
        setReservations(normalized);
      })
      .catch(err => {
        console.error('Fetch error:', err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const cancelReservation = (reservationId, isPaid) => {
    if (isPaid) {
      alert('Cannot cancel a paid reservation.');
      return;
    }
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    const token = getToken();
    if (!token) {
      alert('User token missing, please login again.');
      return;
    }

    fetch('http://localhost:8081/cancel-reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reservationId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Cancel failed');
        }
        return res.json();
      })
      .then(() => {
        alert('Reservation cancelled successfully');
        fetchReservations();
      })
      .catch(err => alert(err.message));
  };

  const payReservation = (reservationId) => {
    if (!window.confirm('Proceed with payment for this reservation?')) return;

    const token = getToken();
    if (!token) {
      alert('User token missing, please login again.');
      return;
    }

    setPayingId(reservationId);

    fetch('http://localhost:8081/pay-reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reservationId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Payment failed');
        }
        return res.json();
      })
      .then(() => {
        alert('Payment successful!');
        fetchReservations();
      })
      .catch(err => alert(err.message))
      .finally(() => setPayingId(null));
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  if (loading) return <p>Loading your reservations...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>My Reservations</h2>
      {reservations.length === 0 ? (
        <p>You have no reservations.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>City</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Departure Date</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Departure Time</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Seats Reserved</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Payment Status</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.reservationId}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{r.city}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{r.departureDate}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{r.departureTime}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{r.numSeats}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                  {r.paid ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>Paid</span>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Not Paid</span>
                  )}
                </td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                  {!r.paid && (
                    <button
                      onClick={() => payReservation(r.reservationId)}
                      disabled={payingId === r.reservationId}
                      style={{ marginRight: '8px' }}
                    >
                      {payingId === r.reservationId ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                  <button
                    onClick={() => cancelReservation(r.reservationId, r.paid)}
                    disabled={r.paid}
                    style={{
                      backgroundColor: r.paid ? 'gray' : 'red',
                      color: 'white',
                      cursor: r.paid ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyTicket;
