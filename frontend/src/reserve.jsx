import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year} at ${time}`;
};

const Reserve = () => {
  const { id: offerId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [numSeats, setNumSeats] = useState(1);
  const [stage, setStage] = useState('selectSeats');
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvv: '',
    expirationDate: '',
  });

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/signin');
  }, [navigate]);

  // Load offer
  useEffect(() => {
    if (!offerId) return;
    fetch(`http://localhost:8081/offers/${offerId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch offer');
        return res.json();
      })
      .then(setOffer)
      .catch(err => {
        console.error('Failed to fetch offer:', err);
        alert('Failed to load offer details.');
        navigate('/');
      });
  }, [offerId, navigate]);

  const handleNext = () => {
    if (numSeats < 1) {
      return alert('You must reserve at least 1 seat.');
    }
    if (numSeats > (offer?.availableSeats || 0)) {
      return alert(`Only ${offer?.availableSeats || 0} seats available.`);
    }
    setStage('payment');
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    // For cardNumber and cvv ensure numeric only
    if (name === 'cardNumber' || name === 'cvv') {
      if (!/^\d*$/.test(value)) return; // block non-numeric input
    }
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, cardNumber, cvv, expirationDate } = paymentInfo;

    if (!firstName || !lastName || !cardNumber || !cvv || !expirationDate) {
      return alert('All fields are required.');
    }

    if (cardNumber.length !== 16) {
      return alert('Card number must be exactly 16 digits.');
    }
    if (cvv.length !== 3) {
      return alert('CVV must be exactly 3 digits.');
    }
    // Basic expiration date MM/YY validation
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
      return alert('Expiration date must be in MM/YY format.');
    }

    const token = localStorage.getItem('token');
    if (!token) return navigate('/signin');

    try {
      const response = await fetch('http://localhost:8081/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          offerId,
          numSeats,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPaymentResult({ success: true, message: 'Reservation successful!' });
      } else {
        setPaymentResult({ success: false, message: data.error || 'Reservation failed.' });
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setPaymentResult({ success: false, message: 'An error occurred.' });
    }

    setStage('result');
  };

  if (!offer) return <p>Loading offer details...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Reserve Trip to {offer.city}</h2>
      <p><strong>Type:</strong> {offer.type}</p>
      <p><strong>Departure:</strong> {formatDateTime(offer.departureDate, offer.departureTime)}</p>
      <p><strong>Landing:</strong> {formatDateTime(offer.landingDate, offer.landingTime)}</p>
      <p><strong>Price:</strong> {offer.price} €</p>
      <p><strong>Available Seats:</strong> {offer.availableSeats}</p>

      {stage === 'selectSeats' && (
        <>
          <label>
            Seats:
            <input
              type="number"
              min="1"
              max={offer.availableSeats}
              value={numSeats}
              onChange={e => {
                let val = Number(e.target.value);
                if (val < 1) val = 1;
                else if (val > offer.availableSeats) val = offer.availableSeats;
                setNumSeats(val);
              }}
              style={styles.input}
            />
          </label>
          <button onClick={handleNext} style={styles.button}>Next</button>
        </>
      )}

      {stage === 'payment' && (
        <form onSubmit={handlePaymentSubmit} style={styles.form}>
          {['firstName', 'lastName', 'cardNumber', 'cvv', 'expirationDate'].map(field => (
            <div key={field} style={styles.formGroup}>
              <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
              <input
                name={field}
                type={field === 'cardNumber' || field === 'cvv' ? 'tel' : 'text'}
                value={paymentInfo[field]}
                onChange={handlePaymentChange}
                maxLength={field === 'cardNumber' ? 16 : field === 'cvv' ? 3 : undefined}
                placeholder={field === 'expirationDate' ? 'MM/YY' : ''}
                style={styles.input}
                required
                inputMode={field === 'cardNumber' || field === 'cvv' ? 'numeric' : undefined}
              />
            </div>
          ))}
          <button type="submit" style={styles.button}>Pay & Reserve</button>
        </form>
      )}

      {stage === 'result' && paymentResult && (
        <div style={{ color: paymentResult.success ? 'green' : 'red' }}>
          <p>{paymentResult.message}</p>
          <button style={styles.button} onClick={() => navigate('/')}>
            {paymentResult.success ? 'Back to Home' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '22px',
    marginBottom: '1rem',
  },
  input: {
    marginLeft: '0.5rem',
    padding: '0.5rem',
    fontSize: '16px',
    width: '60%',
  },
  button: {
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
};

export default Reserve;
