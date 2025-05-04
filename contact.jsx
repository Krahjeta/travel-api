import React from 'react';

function Contact() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Na Kontaktoni</h2>
      <p>Jemi të gatshëm të përgjigjemi në pyetjet tuaja!</p>
      <form>
        <div>
          <label>Emri:</label><br />
          <input type="text" placeholder="Shkruani emrin tuaj" />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" placeholder="Shkruani email-in tuaj" />
        </div>
        <div>
          <label>Mesazhi:</label><br />
          <textarea placeholder="Shkruani mesazhin tuaj"></textarea>
        </div>
        <button type="submit">Dërgo</button>
      </form>
    </div>
  );
}

export default Contact;
