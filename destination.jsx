import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Destinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/destinacione')
      .then(response => {
        setDestinations(response.data);
      })
      .catch(error => {
        console.error('Gabim gjatë marrjes së të dhënave:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lista e Destinacioneve</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Përshkrimi</th>
            <th>Çmimi (€)</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map(dest => (
            <tr key={dest.id}>
              <td>{dest.id}</td>
              <td>{dest.emri}</td>
              <td>{dest.pershkrimi}</td>
              <td>{dest.qmimi} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Destinations;
