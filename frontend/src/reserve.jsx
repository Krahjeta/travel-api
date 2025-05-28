import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year} at ${timeStr}`;
};

const Reserve = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8081/offers/${id}`)
      .then(res => res.json())
      .then(data => setOffer(data))
      .catch(err => console.error('Error fetching offer:', err));
  }, [id]);

  const handleConfirmReservation = () => {
    if (!user || !offer) return;

    fetch('http://localhost:8081/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, offerId: offer.id }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Reservation confirmed!');
        navigate('/');
      })
      .catch(err => {
        console.error('Error reserving offer:', err);
        alert('Failed to reserve the offer.');
      });
  };

  if (!offer) return <p>Loading offer details...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Reserve Offer: {offer.city}</h2>
      <p><strong>Type:</strong> {offer.type}</p>
      <p><strong>Departure:</strong> {formatDateTime(offer.departureDate, offer.departureTime)}</p>
      <p><strong>Landing:</strong> {formatDateTime(offer.landingDate, offer.landingTime)}</p>
      <p><strong>Price:</strong> {offer.price} €</p>

      <button style={styles.button} onClick={handleConfirmReservation}>
        Confirm Reservation
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '1rem',
  },
  button: {
    marginTop: '2rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Reserve;
