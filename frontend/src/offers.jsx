import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ParisImage from './photos/Paris.avif';
import LondonImage from './photos/Londonn.jpeg';
import MonteCarloImage from './photos/MonteCarlo.jpg';
import BarcelonaImage from './photos/Barcelona.webp';
import GreeceImage from './photos/Greece.jpeg';

const imageMap = {
  Paris: ParisImage,
  London: LondonImage,
  MonteCarlo: MonteCarloImage,
  Barcelona: BarcelonaImage,
  Greece: GreeceImage,
};

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year} at ${timeStr}`;
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    fetch('http://localhost:8081/offers')
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error('Error fetching offers:', err));
  }, []);

  const handleActionClick = () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (user.role === 'admin') {
      navigate(`/edit-offer/${selectedOffer.id}`);
    } else {
      navigate(`/reserve/${selectedOffer.id}`);
    }
  };

  const handleDeleteClick = (id) => {
    if (!user || user.role !== 'admin') return;

    const confirmed = window.confirm('Are you sure you want to delete this offer?');
    if (!confirmed) return;

    fetch(`http://localhost:8081/delete-offer?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        alert('Offer deleted successfully');
        setOffers(prev => prev.filter(o => o.id !== id));
        setSelectedOffer(null);
      })
      .catch(err => {
        console.error('Error deleting offer:', err);
        alert('Failed to delete offer.');
      });
  };

  const renderOfferCard = (offer) => (
    <button
      key={offer.id}
      style={styles.imageGridItem}
      onClick={() => setSelectedOffer(offer)}
    >
      <span
        style={{
          ...styles.imageBackground,
          backgroundImage: `url(${imageMap[offer.city] || ''})`,
        }}
      />
      <span style={styles.footer}>
        <span style={styles.location}>{offer.city}</span>
        <span style={styles.price}>
          <span style={styles.priceFrom}>From</span>{' '}
          <span style={styles.priceAmount}>{offer.price} €</span>
        </span>
      </span>
    </button>
  );

  const renderOfferDetails = () => {
    if (!selectedOffer) return null;

    const {
      city,
      type = 'One-way',
      departureDate,
      departureTime,
      landingDate,
      landingTime,
      price,
    } = selectedOffer;

    return (
      <div style={styles.detailsSection}>
        <h3 style={styles.detailsHeading}>Offer Details: {city}</h3>
        <img src={imageMap[city]} alt={city} style={styles.detailsImage} />
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Departure:</strong> {formatDateTime(departureDate, departureTime)}</p>
        <p><strong>Landing:</strong> {formatDateTime(landingDate, landingTime)}</p>
        <p><strong>Price:</strong> {price} €</p>
        {user && user.role === 'admin' ? (
          <>
            <button style={styles.reserveButton} onClick={handleActionClick}>Edit</button>
            <button
              style={{ ...styles.reserveButton, backgroundColor: '#dc3545', marginLeft: '1rem' }}
              onClick={() => handleDeleteClick(selectedOffer.id)}
            >
              Delete
            </button>
          </>
        ) : (
          <button style={styles.reserveButton} onClick={handleActionClick}>Reserve</button>
        )}
      </div>
    );
  };

  return (
    <div style={styles.contentStrip}>
      <div style={styles.container}>
        <div style={styles.leadOffers}>
          <h2 style={styles.heading}>Flight Ticket Offers</h2>
          <p style={styles.subheading}>Book now at the lowest price!</p>

          <div style={styles.imageGrid}>
            {offers.map(renderOfferCard)}
          </div>

          {renderOfferDetails()}

          {user?.role === 'admin' && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                style={{ ...styles.reserveButton, backgroundColor: '#28a745' }}
                onClick={() => navigate('/add-offer')}
              >
                Add Offer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  contentStrip: {
    padding: '2rem 0',
    backgroundColor: '#f7f7f7',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  leadOffers: {
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    margin: 0,
    paddingTop: '1rem',
  },
  subheading: {
    fontSize: '16px',
    marginTop: '0.5rem',
    marginBottom: '2rem',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  imageGridItem: {
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    position: 'relative',
    height: '250px',
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    padding: '0.5rem 1rem',
    zIndex: 2,
  },
  location: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  price: {
    display: 'block',
    marginTop: '0.25rem',
  },
  priceFrom: {
    fontSize: '12px',
    opacity: 0.8,
  },
  priceAmount: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginLeft: '0.25rem',
  },
  detailsSection: {
    marginTop: '3rem',
    textAlign: 'left',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  detailsHeading: {
    fontSize: '20px',
    marginBottom: '1rem',
  },
  detailsImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  reserveButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Offers;
