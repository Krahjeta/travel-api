import React, { useEffect, useState } from 'react';

function Home() {
  const [udhetimet, setUdhetimet] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/udhetimet')
      .then(res => res.json())
      .then(data => {
        console.log(data); // Kontrollo të dhënat në console
        setUdhetimet(data);
      })
      .catch(err => console.error('Gabim gjatë fetch:', err));
  }, []);

  return (
    <div>
      <h1>Lista e Udhëtimeve</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Destinacioni</th>
            <th>Data Nisjes</th>
            <th>Çmimi (€)</th>
          </tr>
        </thead>
        <tbody>
          {udhetimet.map((udhetim) => (
            <tr key={udhetim.id}>
              <td>{udhetim.id}</td>
              <td>{udhetim.destinacion_emri}</td>
              <td>{new Date(udhetim.data_nisjes).toLocaleDateString()}</td>
              <td>{udhetim.qmimi} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
