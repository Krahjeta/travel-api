import React from 'react';

function MyTicket() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Ticket</h1>
      <p>Here are your ticket details:</p>
      <ul>
        <li><strong>Ticket ID:</strong> 123456</li>
        <li><strong>Destination:</strong> Paris, France</li>
        <li><strong>Date:</strong> 2025-05-10</li>
        <li><strong>Seat Number:</strong> 12A</li>
      </ul>
      <p>If you need to make changes, please contact support.</p>
    </div>
  );
}

export default MyTicket;
