

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './home.jsx';
import Navbar from './Navbar.jsx'; // nëse ke bërë Navbar më parë
import BookTicket from "./bookTicket.jsx";
import MyTicket from "./myTicket.jsx";
import Offers from "./offers.jsx";
import SignIn from "./Login.jsx";
import SignUp from "./signup.jsx";
import EditOffer from './editOffer.jsx';
import AddOffers from './addOffer.jsx'; 
import Reserve from './reserve.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookTicket />} />
        <Route path="/myTicket" element={<MyTicket />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/edit-offer/:id" element={<EditOffer />} />
        <Route path="/add-offer" element={<AddOffers />} />
          <Route path="/reserve/:id" element={<Reserve />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

