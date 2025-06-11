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

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/signin');
  }, [navigate]);

  
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
    
    if (name === 'cardNumber' || name === 'cvv') {
      if (!/^\d*$/.test(value)) return; 
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

  if (!offer) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loading}>
          <p>Loading offer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Reserve Your Trip</h1>
        <p style={styles.subtitle}>Complete your booking in a few simple steps</p>
      </div>

      <div style={styles.container}>
        {/* Trip Details Card */}
        <div style={styles.tripCard}>
          <h2 style={styles.tripTitle}>Trip to {offer.city}</h2>
          <div style={styles.tripDetails}>
            <div style={styles.detailItem}>
              <span style={styles.label}>Type:</span>
              <span style={styles.value}>{offer.type}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Departure:</span>
              <span style={styles.value}>{formatDateTime(offer.departureDate, offer.departureTime)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Landing:</span>
              <span style={styles.value}>{formatDateTime(offer.landingDate, offer.landingTime)}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Price per seat:</span>
              <span style={styles.price}>€{offer.price}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Available seats:</span>
              <span style={styles.available}>{offer.availableSeats}</span>
            </div>
          </div>
        </div>

        
        <div style={styles.bookingCard}>
          
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: stage === 'selectSeats' ? '33%' : stage === 'payment' ? '66%' : '100%'
              }}></div>
            </div>
            <div style={styles.progressSteps}>
              <span style={stage === 'selectSeats' ? styles.activeStep : styles.step}>1. Select Seats</span>
              <span style={stage === 'payment' ? styles.activeStep : styles.step}>2. Payment</span>
              <span style={stage === 'result' ? styles.activeStep : styles.step}>3. Confirmation</span>
            </div>
          </div>

          
          {stage === 'selectSeats' && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>Select Number of Seats</h3>
              <div style={styles.seatSelector}>
                <label style={styles.seatLabel}>Number of seats:</label>
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
                  style={styles.seatInput}
                />
              </div>
              <div style={styles.totalPrice}>
                <strong>Total: €{(offer.price * numSeats).toFixed(2)}</strong>
              </div>
              <button onClick={handleNext} style={styles.nextButton}>
                Continue to Payment
              </button>
            </div>
          )}

          {/* pagesa */}
          {stage === 'payment' && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>Payment Information</h3>
              <div style={styles.bookingSummary}>
                <p><strong>Booking Summary:</strong></p>
                <p>{numSeats} seat{numSeats > 1 ? 's' : ''} × €{offer.price} = <strong>€{(offer.price * numSeats).toFixed(2)}</strong></p>
              </div>
              
              <form onSubmit={handlePaymentSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      value={paymentInfo.firstName}
                      onChange={handlePaymentChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      value={paymentInfo.lastName}
                      onChange={handlePaymentChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Card Number</label>
                  <input
                    name="cardNumber"
                    type="tel"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    maxLength={16}
                    placeholder="1234 5678 9012 3456"
                    style={styles.formInput}
                    required
                    inputMode="numeric"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Expiry Date</label>
                    <input
                      name="expirationDate"
                      type="text"
                      value={paymentInfo.expirationDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      style={styles.formInput}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>CVV</label>
                    <input
                      name="cvv"
                      type="tel"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      maxLength={3}
                      placeholder="123"
                      style={styles.formInput}
                      required
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div style={styles.formActions}>
                  <button 
                    type="button" 
                    onClick={() => setStage('selectSeats')}
                    style={styles.backButton}
                  >
                    Back
                  </button>
                  <button type="submit" style={styles.payButton}>
                    Pay & Reserve
                  </button>
                </div>
              </form>
            </div>
          )}

          
          {stage === 'result' && paymentResult && (
            <div style={styles.stepContent}>
              <div style={{
                ...styles.resultCard,
                borderColor: paymentResult.success ? '#28a745' : '#dc3545'
              }}>
                <div style={{
                  ...styles.resultIcon,
                  color: paymentResult.success ? '#28a745' : '#dc3545'
                }}>
                  {paymentResult.success ? '✅' : '❌'}
                </div>
                <h3 style={styles.resultTitle}>
                  {paymentResult.success ? 'Booking Confirmed!' : 'Booking Failed'}
                </h3>
                <p style={styles.resultMessage}>{paymentResult.message}</p>
                <button 
                  style={styles.homeButton} 
                  onClick={() => navigate('/')}
                >
                  {paymentResult.success ? 'Back to Home' : 'Try Again'}
                </button>
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
    padding: '20px 0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0,
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  tripTitle: {
    fontSize: '1.5rem',
    color: '#950606',
    marginBottom: '20px',
    textAlign: 'center',
  },
  tripDetails: {
    display: 'grid',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f1f1f1',
  },
  label: {
    fontWeight: '500',
    color: '#555',
  },
  value: {
    color: '#333',
  },
  price: {
    color: '#950606',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  available: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  progressContainer: {
    marginBottom: '30px',
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#e9ecef',
    borderRadius: '2px',
    marginBottom: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#950606',
    transition: 'width 0.3s ease',
  },
  progressSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  step: {
    color: '#999',
  },
  activeStep: {
    color: '#950606',
    fontWeight: 'bold',
  },
  stepContent: {
    minHeight: '200px',
  },
  stepTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  seatSelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  seatLabel: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  seatInput: {
    padding: '8px 12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    width: '80px',
    textAlign: 'center',
  },
  totalPrice: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#950606',
  },
  nextButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  bookingSummary: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    marginBottom: '5px',
    fontWeight: '500',
    color: '#555',
  },
  formInput: {
    padding: '10px 12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  backButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  payButton: {
    flex: 2,
    padding: '12px',
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  resultCard: {
    border: '2px solid',
    borderRadius: '10px',
    padding: '30px',
    textAlign: 'center',
  },
  resultIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  resultTitle: {
    fontSize: '1.5rem',
    marginBottom: '15px',
    color: '#333',
  },
  resultMessage: {
    fontSize: '1rem',
    marginBottom: '20px',
    color: '#666',
  },
  homeButton: {
    padding: '12px 30px',
    backgroundColor: '#950606',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.1rem',
    color: '#666',
  },
};

export default Reserve;