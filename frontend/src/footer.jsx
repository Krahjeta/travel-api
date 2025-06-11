import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
         
          <div style={styles.section}>
            <h3 style={styles.heading}>Travel Agency</h3>
            <p style={styles.text}>
              Your trusted partner for amazing travel experiences around the world.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>Facebook</a>
              <a href="#" style={styles.socialLink}>Twitter</a>
              <a href="#" style={styles.socialLink}>Instagram</a>
            </div>
          </div>

         
          <div style={styles.section}>
            <h4 style={styles.subHeading}>Quick Links</h4>
            <ul style={styles.list}>
              <li><a href="/" style={styles.link}>Home</a></li>
              <li><a href="/book" style={styles.link}>Book Ticket</a></li>
              <li><a href="/myTicket" style={styles.link}>My Ticket</a></li>
              <li><a href="/offers" style={styles.link}>Offers</a></li>
            </ul>
          </div>

          
          <div style={styles.section}>
            <h4 style={styles.subHeading}>Support</h4>
            <ul style={styles.list}>
              <li><a href="#" style={styles.link}>Help Center</a></li>
              <li><a href="#" style={styles.link}>Contact Us</a></li>
              <li><a href="#" style={styles.link}>Privacy Policy</a></li>
              <li><a href="#" style={styles.link}>Terms of Service</a></li>
            </ul>
          </div>
           
          <div style={styles.section}>
            <h4 style={styles.subHeading}>Contact Info</h4>
            <div style={styles.contactInfo}>
              <p style={styles.contactItem}>📧 info@travelagency.com</p>
              <p style={styles.contactItem}>📞 +383 49 444-444</p>
              <p style={styles.contactItem}>📍 123 Travel Street, City, Country</p>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © 2024 Travel Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    color: '#950606',
    fontSize: '1.5rem',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '15px',
    fontWeight: '600',
  },
  text: {
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#bdc3c7',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  link: {
    color: '#bdc3c7',
    textDecoration: 'none',
    lineHeight: '2',
    transition: 'color 0.3s ease',
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
  },
  socialLink: {
    color: '#950606',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  contactItem: {
    color: '#bdc3c7',
    margin: 0,
    lineHeight: '1.5',
  },
  bottom: {
    borderTop: '1px solid #34495e',
    paddingTop: '20px',
    textAlign: 'center',
  },
  copyright: {
    color: '#95a5a6',
    margin: 0,
    fontSize: '0.9rem',
  },
};

export default Footer;