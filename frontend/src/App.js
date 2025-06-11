import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from './home.jsx';
import Navbar from './Navbar.jsx';
import Footer from './footer.jsx'; 
import BookTicket from "./bookTicket.jsx";
import MyTicket from "./myTicket.jsx";
import Offers from "./offers.jsx";
import SignIn from "./Login.jsx";
import SignUp from "./signup.jsx";
import EditOffer from './editOffer.jsx';
import AddOffers from './addOffer.jsx'; 
import Reserve from './reserve.jsx';
import Dashboard from './dashboard.jsx';
import EditAdminDashboard from './editAdminDashboard.jsx';
import AddFlight from './addFlight.jsx';

function App() {
  const [user, setUser] = useState(null); 

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} setUser={setUser} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookTicket />} />
            <Route 
              path="/myTicket" 
              element={user ? <MyTicket user={user} /> : <Navigate to="/signin" replace />} 
            />
            <Route path="/offers" element={<Offers />} />
            <Route path="/signin" element={<SignIn setUser={setUser} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/edit-offer/:id" element={<EditOffer />} />
            <Route path="/add-offer" element={<AddOffers />} />
            <Route path="/reserve/:id" element={<Reserve />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-admin/:type/:id" element={<EditAdminDashboard />} />
            <Route path="/add-flight" element={<AddFlight />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;