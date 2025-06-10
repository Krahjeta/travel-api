const http = require('http');
const mysql = require('mysql');
const url = require('url');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'your_super_secret_key';
const SALT_ROUNDS = 10;
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travelagency',
});
db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database.');
});
function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('❌ Database query error:', err.message);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) reject(new Error('Request body too large'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}
function formatDatesForFrontend(obj) {
  if (!obj) return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => formatDatesForFrontend(item));
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const formatted = { ...obj };
    
    // Format date fields
    if (formatted.departureDate) {
      formatted.departureDate = new Date(formatted.departureDate).toISOString().split('T')[0];
    }
    if (formatted.landingDate) {
      formatted.landingDate = new Date(formatted.landingDate).toISOString().split('T')[0];
    }
    if (formatted.data_fluturimit) {
      formatted.data_fluturimit = new Date(formatted.data_fluturimit).toISOString().split('T')[0];
    }
    if (formatted.reservationDate) {
      formatted.reservationDate = new Date(formatted.reservationDate).toISOString().split('T')[0];
    }
    
    // Format time fields (remove seconds)
    if (formatted.departureTime && formatted.departureTime.includes(':')) {
      formatted.departureTime = formatted.departureTime.substring(0, 5);
    }
    if (formatted.landingTime && formatted.landingTime.includes(':')) {
      formatted.landingTime = formatted.landingTime.substring(0, 5);
    }
    if (formatted.ora_fluturimit && formatted.ora_fluturimit.includes(':')) {
      formatted.ora_fluturimit = formatted.ora_fluturimit.substring(0, 5);
    }
    
    return formatted;
  }
  
  return obj;
}

function sendJSON(res, statusCode, data) {
  const formattedData = formatDatesForFrontend(data);
  const payload = JSON.stringify(formattedData);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}
function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { error: message });
}
async function verifyToken(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return sendError(res, 401, 'Missing Authorization header'), null;
  const token = authHeader.split(' ')[1];
  if (!token) return sendError(res, 401, 'Missing token'), null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    sendError(res, 403, 'Invalid or expired token');
    return null;
  }
}
function verifyAdmin(user, res) {
  if (!user || user.role !== 'admin') {
    sendError(res, 403, 'Admin access required');
    return false;
  }
  return true;
}
// ====== Utility ======
function formatDateToMySQL(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [part1, part2, year] = parts.map(p => parseInt(p));
  const month = part1 > 12 ? part2 : part1;
  const day = part1 > 12 ? part1 : part2;
  const formatted = new Date(year, month - 1, day);
  return isNaN(formatted.getTime()) ? null : formatted.toISOString().split('T')[0];
}
// ====== AUTH ======
async function handleSignup(req, res) {
  try {
    const { name, email, password, role = 'user' } = await parseJSONBody(req);
    if (!name || !email || !password) return sendError(res, 400, 'Missing signup fields');
    const existing = await queryAsync('SELECT id FROM login WHERE email = ?', [email]);
    if (existing.length > 0) return sendError(res, 409, 'Email already registered');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await queryAsync('INSERT INTO login (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);
    sendJSON(res, 201, { message: 'Signup successful' });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}
async function handleSignin(req, res) {
  try {
    const { email, password } = await parseJSONBody(req);
    if (!email || !password) return sendError(res, 400, 'Missing email or password');
    const results = await queryAsync('SELECT id, name, email, password, role FROM login WHERE email = ?', [email]);
    if (results.length === 0) return sendError(res, 401, 'Invalid credentials');
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, 401, 'Invalid credentials');
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    delete user.password;
    sendJSON(res, 200, { message: 'Login successful', token, user });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}
// ====== Flight Search ======
async function handleSearchFlights(req, res) {
  try {
    const { departureCity, arrivalCity, flightDate, minPrice, maxPrice } = await parseJSONBody(req);
    const conditions = [];
    const params = [];
    if (departureCity) {
      conditions.push('LOWER(dep_air.qyteti) LIKE LOWER(?)');
      params.push(`%${departureCity}%`);
    }
    if (arrivalCity) {
      conditions.push('LOWER(arr_air.qyteti) LIKE LOWER(?)');
      params.push(`%${arrivalCity}%`);
    }
    if (flightDate) {
      const formattedDate = formatDateToMySQL(flightDate);
      if (formattedDate) {
        conditions.push('f.data_fluturimit = ?');
        params.push(formattedDate);
      }
    }
    if (minPrice) {
      conditions.push('f.qmimi >= ?');
      params.push(minPrice);
    }
    if (maxPrice) {
      conditions.push('f.qmimi <= ?');
      params.push(maxPrice);
    }
    let sql = `
      SELECT
        f.id,
        a1.emri AS airline,
        dep_air.emri AS departureAirport,
        dep_air.qyteti AS departureCity,
        arr_air.emri AS arrivalAirport,
        arr_air.qyteti AS arrivalCity,
        f.data_fluturimit,
        f.ora_fluturimit,
        f.qmimi,
        f.vendet_disponueshme
      FROM flights f
      LEFT JOIN airlines a1 ON f.airline_id = a1.id
      LEFT JOIN airports dep_air ON f.aeroporti_nisjes_id = dep_air.id
      LEFT JOIN airports arr_air ON f.aeroporti_mberritjes_id = arr_air.id
    `;
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    const results = await queryAsync(sql, params);
    sendJSON(res, 200, results);
  } catch (error) {
    sendError(res, 400, error.message);
  }
}
// ====== OFFERS ======
async function handleGetOffers(req, res) {
  try {
    const offers = await queryAsync('SELECT * FROM offers');
    sendJSON(res, 200, offers);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleGetSingleOffer(req, res, offerId) {
  try {
    const offers = await queryAsync('SELECT * FROM offers WHERE id = ?', [offerId]);
    if (offers.length === 0) return sendError(res, 404, 'Offer not found');
    sendJSON(res, 200, offers[0]);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleAddOffer(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats = 0, image = '' } = body;
    if (!city || !type || !departureDate || !departureTime || !landingDate || !landingTime || !price) {
      return sendError(res, 400, 'Missing offer fields');
    }
    const sql = `INSERT INTO offers (city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const result = await queryAsync(sql, [city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image]);
    sendJSON(res, 201, { id: result.insertId, city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image });
  } catch (error) {
    console.error('Add offer error:', error);
    sendError(res, 400, error.message);
  }
}
async function handleEditOffer(req, res, user, offerId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats = 0, image = '' } = body;
    if (!city || !type || !departureDate || !departureTime || !landingDate || !landingTime || !price) {
      return sendError(res, 400, 'Missing offer fields');
    }
    const sql = `UPDATE offers SET city = ?, type = ?, departureDate = ?, departureTime = ?, landingDate = ?, landingTime = ?, price = ?, availableSeats = ?, image = ? WHERE id = ?`;
    const result = await queryAsync(sql, [city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image, offerId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Offer not found');
    sendJSON(res, 200, { message: 'Offer updated successfully', id: offerId, city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image });
  } catch (error) {
    console.error('Edit offer error:', error);
    sendError(res, 400, error.message);
  }
}
// ====== RESERVATIONS ======
async function handleReserve(req, res, user) {
  try {
    const { offerId, numSeats } = await parseJSONBody(req);
    if (!offerId || !numSeats || isNaN(numSeats) || numSeats <= 0) {
      return sendError(res, 400, 'Invalid reservation data');
    }
    const offers = await queryAsync('SELECT availableSeats FROM offers WHERE id = ?', [offerId]);
    if (offers.length === 0) return sendError(res, 404, 'Offer not found');
    const available = offers[0].availableSeats;
    if (available < numSeats) return sendError(res, 400, `Only ${available} seats available`);
    await queryAsync(
      'INSERT INTO reservations (userId, offerId, numSeats, paid) VALUES (?, ?, ?, ?)',
      [user.id, offerId, numSeats, 0]
    );
    await queryAsync('UPDATE offers SET availableSeats = availableSeats - ? WHERE id = ?', [numSeats, offerId]);
    sendJSON(res, 201, { message: 'Reservation successful' });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}
async function handleGetReservations(req, res, user) {
  try {
    const reservations = await queryAsync(
     `SELECT 
     r.id AS reservationId,
     r.numSeats,
     r.paid,
     r.reservationDate,
     
     -- From Offers
     o.city AS offerCity,
     o.type AS offerType,
     o.departureDate AS offerDepartureDate,
     o.departureTime AS offerDepartureTime,
     o.price AS offerPrice,
     -- From Flights
     f.data_fluturimit AS flightDate,
     f.ora_fluturimit AS flightTime,
     f.qmimi AS flightPrice,
     anis.emri AS departureAirport,
     mber.emri AS arrivalAirport,
     anis.qyteti AS departureCity,
     mber.qyteti AS arrivalCity,
     al.emri AS airlineName
     
   FROM reservations r
   LEFT JOIN offers o ON r.offerId = o.id
   LEFT JOIN flights f ON r.flightId = f.id
   LEFT JOIN airports anis ON f.aeroporti_nisjes_id = anis.id
   LEFT JOIN airports mber ON f.aeroporti_mberritjes_id = mber.id
   LEFT JOIN airlines al ON f.airline_id = al.id
   WHERE r.userId = ?`,
  [user.id]
    );
    sendJSON(res, 200, reservations);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handlePayReservation(req, res, user) {
  try {
    const { reservationId } = await parseJSONBody(req);
    if (!reservationId) return sendError(res, 400, 'Missing reservationId');
    const results = await queryAsync(
      'SELECT paid FROM reservations WHERE id = ? AND userId = ?',
      [reservationId, user.id]
    );
    if (results.length === 0) return sendError(res, 404, 'Reservation not found');
    if (results[0].paid) return sendError(res, 400, 'Reservation already paid');
    await queryAsync('UPDATE reservations SET paid = 1 WHERE id = ?', [reservationId]);
    sendJSON(res, 200, { message: 'Payment successful' });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}
async function handleReserveTicket(req, res, user) {
  try {
    const { flightId, numSeats, paid } = await parseJSONBody(req);
    if (!flightId || !numSeats || isNaN(numSeats) || numSeats <= 0) {
      return sendError(res, 400, 'Invalid reservation data');
    }
    const flights = await queryAsync('SELECT vendet_disponueshme FROM flights WHERE id = ?', [flightId]);
    if (flights.length === 0) return sendError(res, 404, 'Flight not found');
    const available = flights[0].vendet_disponueshme;
    if (available < numSeats) return sendError(res, 400, `Only ${available} seats available`);
    await queryAsync(
      'INSERT INTO reservations (userId, flightId, numSeats, paid) VALUES (?, ?, ?, ?)',
      [user.id, flightId, numSeats, paid || 0]
    );
    await queryAsync('UPDATE flights SET vendet_disponueshme = vendet_disponueshme - ? WHERE id = ?', [numSeats, flightId]);
    sendJSON(res, 201, { message: 'Flight reservation successful' });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}
// ====== ADMIN ENDPOINTS ======
async function handleGetAllUsers(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const users = await queryAsync('SELECT id, name, email, role FROM login ORDER BY id DESC');
    sendJSON(res, 200, users);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleGetAllReservations(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const reservations = await queryAsync(`
      SELECT 
        r.id,
        r.numSeats,
        r.paid,
        r.reservationDate,
        l.name AS userName,
        l.email AS userEmail,
        
        -- From Offers
        o.city AS offerCity,
        o.type AS offerType,
        o.departureDate AS offerDepartureDate,
        o.departureTime AS offerDepartureTime,
        o.price AS offerPrice,
        -- From Flights
        f.data_fluturimit AS flightDate,
        f.ora_fluturimit AS flightTime,
        f.qmimi AS flightPrice,
        anis.emri AS departureAirport,
        mber.emri AS arrivalAirport,
        anis.qyteti AS departureCity,
        mber.qyteti AS arrivalCity,
        al.emri AS airlineName
        
      FROM reservations r
      LEFT JOIN login l ON r.userId = l.id
      LEFT JOIN offers o ON r.offerId = o.id
      LEFT JOIN flights f ON r.flightId = f.id
      LEFT JOIN airports anis ON f.aeroporti_nisjes_id = anis.id
      LEFT JOIN airports mber ON f.aeroporti_mberritjes_id = mber.id
      LEFT JOIN airlines al ON f.airline_id = al.id
      ORDER BY r.reservationDate DESC
    `);
    
    sendJSON(res, 200, reservations);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleGetAllFlights(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const flights = await queryAsync(`
      SELECT
        f.id,
        a1.emri AS airline,
        dep_air.emri AS departureAirport,
        dep_air.qyteti AS departureCity,
        arr_air.emri AS arrivalAirport,
        arr_air.qyteti AS arrivalCity,
        f.data_fluturimit,
        f.ora_fluturimit,
        f.qmimi,
        f.vendet_disponueshme
      FROM flights f
      LEFT JOIN airlines a1 ON f.airline_id = a1.id
      LEFT JOIN airports dep_air ON f.aeroporti_nisjes_id = dep_air.id
      LEFT JOIN airports arr_air ON f.aeroporti_mberritjes_id = arr_air.id
      ORDER BY f.data_fluturimit DESC
    `);
    
    sendJSON(res, 200, flights);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleGetAllAirlines(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const airlines = await queryAsync('SELECT * FROM airlines ORDER BY emri');
    sendJSON(res, 200, airlines);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleGetAllAirports(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const airports = await queryAsync(`
      SELECT 
        a.id,
        a.emri,
        a.qyteti,
        s.emri AS shteti_name
      FROM airports a
      LEFT JOIN shtetet s ON a.shteti_id = s.id
      ORDER BY a.qyteti, a.emri
    `);
    sendJSON(res, 200, airports);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
async function handleGetAllCountries(req, res, user) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const countries = await queryAsync('SELECT * FROM shtetet ORDER BY emri');
    sendJSON(res, 200, countries);
  } catch (err) {
    sendError(res, 500, err.message);
  }
}
// ====== DELETE ENDPOINTS ======
async function handleDeleteOffer(req, res, user, offerId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Check if offer has reservations
    const reservations = await queryAsync('SELECT id FROM reservations WHERE offerId = ?', [offerId]);
    if (reservations.length > 0) {
      return sendError(res, 400, `Cannot delete offer - it has ${reservations.length} reservation(s). Delete the reservations first.`);
    }
    const result = await queryAsync('DELETE FROM offers WHERE id = ?', [offerId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Offer not found');
    }
    sendJSON(res, 200, { message: 'Offer deleted successfully' });
  } catch (err) {
    console.error('Delete offer error:', err);
    sendError(res, 500, err.message);
  }
}
async function handleDeleteUser(req, res, user, userId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Don't allow deleting yourself
    if (user.id == userId) {
      return sendError(res, 400, 'Cannot delete your own account');
    }
    // Check if user has reservations
    const reservations = await queryAsync('SELECT id FROM reservations WHERE userId = ?', [userId]);
    if (reservations.length > 0) {
      return sendError(res, 400, `Cannot delete user - they have ${reservations.length} reservation(s). Delete their reservations first.`);
    }
    const result = await queryAsync('DELETE FROM login WHERE id = ?', [userId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'User not found');
    }
    sendJSON(res, 200, { message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    sendError(res, 500, err.message);
  }
}
async function handleDeleteFlight(req, res, user, flightId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Check if flight has reservations
    const reservations = await queryAsync('SELECT id FROM reservations WHERE flightId = ?', [flightId]);
    if (reservations.length > 0) {
      return sendError(res, 400, `Cannot delete flight - it has ${reservations.length} reservation(s). Delete the reservations first.`);
    }
    const result = await queryAsync('DELETE FROM flights WHERE id = ?', [flightId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Flight not found');
    }
    sendJSON(res, 200, { message: 'Flight deleted successfully' });
  } catch (err) {
    console.error('Delete flight error:', err);
    sendError(res, 500, err.message);
  }
}
async function handleDeleteAirline(req, res, user, airlineId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Check if airline is used in flights
    const flightsUsing = await queryAsync('SELECT id FROM flights WHERE airline_id = ?', [airlineId]);
    if (flightsUsing.length > 0) {
      return sendError(res, 400, `Cannot delete airline - it is used in ${flightsUsing.length} flight(s). Delete the flights first.`);
    }
    const result = await queryAsync('DELETE FROM airlines WHERE id = ?', [airlineId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Airline not found');
    }
    sendJSON(res, 200, { message: 'Airline deleted successfully' });
  } catch (err) {
    console.error('Delete airline error:', err);
    sendError(res, 500, err.message);
  }
}
async function handleDeleteAirport(req, res, user, airportId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Check if airport is used in flights
    const flightsUsing = await queryAsync(
      'SELECT id FROM flights WHERE aeroporti_nisjes_id = ? OR aeroporti_mberritjes_id = ?', 
      [airportId, airportId]
    );
    if (flightsUsing.length > 0) {
      return sendError(res, 400, `Cannot delete airport - it is used in ${flightsUsing.length} flight(s). Delete the flights first.`);
    }
    const result = await queryAsync('DELETE FROM airports WHERE id = ?', [airportId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Airport not found');
    }
    sendJSON(res, 200, { message: 'Airport deleted successfully' });
  } catch (err) {
    console.error('Delete airport error:', err);
    sendError(res, 500, err.message);
  }
}
async function handleDeleteCountry(req, res, user, countryId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Check if country is used in airports
    const airportsUsing = await queryAsync('SELECT id FROM airports WHERE shteti_id = ?', [countryId]);
    if (airportsUsing.length > 0) {
      return sendError(res, 400, `Cannot delete country - it is used in ${airportsUsing.length} airport(s). Delete the airports first.`);
    }
    const result = await queryAsync('DELETE FROM shtetet WHERE id = ?', [countryId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Country not found');
    }
    sendJSON(res, 200, { message: 'Country deleted successfully' });
  } catch (err) {
    console.error('Delete country error:', err);
    sendError(res, 500, err.message);
  }
}
async function handleDeleteReservation(req, res, user, reservationId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    // Get reservation details before deleting to restore seats
    const reservations = await queryAsync(
      'SELECT offerId, flightId, numSeats FROM reservations WHERE id = ?', 
      [reservationId]
    );
    
    if (reservations.length === 0) {
      return sendError(res, 404, 'Reservation not found');
    }
    const reservation = reservations[0];
    // Delete the reservation
    const result = await queryAsync('DELETE FROM reservations WHERE id = ?', [reservationId]);
    
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Reservation not found');
    }
    // Restore seats if it was for an offer
    if (reservation.offerId) {
      await queryAsync(
        'UPDATE offers SET availableSeats = availableSeats + ? WHERE id = ?', 
        [reservation.numSeats, reservation.offerId]
      );
    }
    // Restore seats if it was for a flight
    if (reservation.flightId) {
      await queryAsync(
        'UPDATE flights SET vendet_disponueshme = vendet_disponueshme + ? WHERE id = ?', 
        [reservation.numSeats, reservation.flightId]
      );
    }
    sendJSON(res, 200, { message: 'Reservation deleted successfully and seats restored' });
  } catch (err) {
    console.error('Delete reservation error:', err);
    sendError(res, 500, err.message);
  }
}

// ====== ADDITIONAL EDIT HANDLERS ======
async function handleEditUser(req, res, user, userId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { name, email, role } = body;
    if (!name || !email || !role) {
      return sendError(res, 400, 'Missing user fields');
    }
    const sql = `UPDATE login SET name = ?, email = ?, role = ? WHERE id = ?`;
    const result = await queryAsync(sql, [name, email, role, userId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'User not found');
    sendJSON(res, 200, { message: 'User updated successfully' });
  } catch (error) {
    console.error('Edit user error:', error);
    sendError(res, 400, error.message);
  }
}
async function handleEditAirline(req, res, user, airlineId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { emri } = body;
    if (!emri) {
      return sendError(res, 400, 'Missing airline name');
    }
    const sql = `UPDATE airlines SET emri = ? WHERE id = ?`;
    const result = await queryAsync(sql, [emri, airlineId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Airline not found');
    sendJSON(res, 200, { message: 'Airline updated successfully' });
  } catch (error) {
    console.error('Edit airline error:', error);
    sendError(res, 400, error.message);
  }
}
async function handleEditCountry(req, res, user, countryId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { emri } = body;
    if (!emri) {
      return sendError(res, 400, 'Missing country name');
    }
    const sql = `UPDATE shtetet SET emri = ? WHERE id = ?`;
    const result = await queryAsync(sql, [emri, countryId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Country not found');
    sendJSON(res, 200, { message: 'Country updated successfully' });
  } catch (error) {
    console.error('Edit country error:', error);
    sendError(res, 400, error.message);
  }
}
async function handleEditReservation(req, res, user, reservationId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { numSeats, paid } = body;
    if (!numSeats || typeof paid === 'undefined') {
      return sendError(res, 400, 'Missing reservation fields');
    }
    const sql = `UPDATE reservations SET numSeats = ?, paid = ? WHERE id = ?`;
    const result = await queryAsync(sql, [numSeats, paid ? 1 : 0, reservationId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Reservation not found');
    sendJSON(res, 200, { message: 'Reservation updated successfully' });
  } catch (error) {
    console.error('Edit reservation error:', error);
    sendError(res, 400, error.message);
  }
}
async function handleEditAirport(req, res, user, airportId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { emri, qyteti } = body;
    if (!emri || !qyteti) {
      return sendError(res, 400, 'Missing airport fields');
    }
    const sql = `UPDATE airports SET emri = ?, qyteti = ? WHERE id = ?`;
    const result = await queryAsync(sql, [emri, qyteti, airportId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Airport not found');
    sendJSON(res, 200, { message: 'Airport updated successfully' });
  } catch (error) {
    console.error('Edit airport error:', error);
    sendError(res, 400, error.message);
  }
}
async function handleEditFlight(req, res, user, flightId) {
  try {
    if (!verifyAdmin(user, res)) {
      return;
    }
    const body = await parseJSONBody(req);
    const { data_fluturimit, ora_fluturimit, qmimi, vendet_disponueshme } = body;
    if (!data_fluturimit || !ora_fluturimit || !qmimi || !vendet_disponueshme) {
      return sendError(res, 400, 'Missing flight fields');
    }
    const sql = `UPDATE flights SET data_fluturimit = ?, ora_fluturimit = ?, qmimi = ?, vendet_disponueshme = ? WHERE id = ?`;
    const result = await queryAsync(sql, [data_fluturimit, ora_fluturimit, qmimi, vendet_disponueshme, flightId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Flight not found');
    sendJSON(res, 200, { message: 'Flight updated successfully' });
  } catch (error) {
    console.error('Edit flight error:', error);
    sendError(res, 400, error.message);
  }
}
// ====== SERVER SETUP ======
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const pathParts = path.split('/').filter(Boolean);
  console.log(`${method} ${path}`);
  try {
    // Authentication routes
    if (path === '/signup' && method === 'POST') {
      await handleSignup(req, res);
    } else if (path === '/signin' && method === 'POST') {
      await handleSignin(req, res);
    } 
    
    // Flight search
    else if (path === '/search-flights' && method === 'POST') {
      await handleSearchFlights(req, res);
    }
    
    // Offers routes
    else if (path === '/offers' && method === 'GET') {
      await handleGetOffers(req, res);
    } else if (path.match(/^\/offers\/\d+$/) && method === 'GET') {
      const offerId = path.split('/')[2];
      await handleGetSingleOffer(req, res, offerId);
    } else if (path === '/add-offer' && method === 'POST') {
      const user = await verifyToken(req, res);
      if (user) await handleAddOffer(req, res, user);
    } else if (req.method === 'PUT' && pathParts[0] === 'edit-offer' && pathParts.length === 2) {
      const user = await verifyToken(req, res);
      if (user) await handleEditOffer(req, res, user, pathParts[1]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'delete-offer' && pathParts.length === 2) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteOffer(req, res, user, pathParts[1]);
    }
    
    // Reservation routes
    else if (path === '/reserve' && method === 'POST') {
      const user = await verifyToken(req, res);
      if (user) await handleReserve(req, res, user);
    } else if (path === '/reserve-ticket' && method === 'POST') {
      const user = await verifyToken(req, res);
      if (user) await handleReserveTicket(req, res, user);
    } else if (path === '/reservations' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetReservations(req, res, user);
    } else if (path === '/pay-reservation' && method === 'POST') {
      const user = await verifyToken(req, res);
      if (user) await handlePayReservation(req, res, user);
    }
    
    // Admin data routes
    else if (path === '/admin/users' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetAllUsers(req, res, user);
    } else if (path === '/admin/reservations' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetAllReservations(req, res, user);
    } else if (path === '/admin/flights' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetAllFlights(req, res, user);
    } else if (path === '/admin/airlines' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetAllAirlines(req, res, user);
    } else if (path === '/admin/airports' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetAllAirports(req, res, user);
    } else if (path === '/admin/countries' && method === 'GET') {
      const user = await verifyToken(req, res);
      if (user) await handleGetAllCountries(req, res, user);
    }
    
    // Admin delete routes
    else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-user' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteUser(req, res, user, pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-offer' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteOffer(req, res, user, pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-flight' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteFlight(req, res, user, pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-airline' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteAirline(req, res, user, pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-airport' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteAirport(req, res, user, pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-country' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteCountry(req, res, user, pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts[0] === 'admin' && pathParts[1] === 'delete-reservation' && pathParts.length === 3) {
      const user = await verifyToken(req, res);
      if (user) await handleDeleteReservation(req, res, user, pathParts[2]);
    }

    else if (req.method === 'PUT' && pathParts[0] === 'admin' && pathParts[1] === 'edit-user' && pathParts.length === 3) {
  const user = await verifyToken(req, res);
  if (user) await handleEditUser(req, res, user, pathParts[2]);
} else if (req.method === 'PUT' && pathParts[0] === 'admin' && pathParts[1] === 'edit-airline' && pathParts.length === 3) {
  const user = await verifyToken(req, res);
  if (user) await handleEditAirline(req, res, user, pathParts[2]);
} else if (req.method === 'PUT' && pathParts[0] === 'admin' && pathParts[1] === 'edit-country' && pathParts.length === 3) {
  const user = await verifyToken(req, res);
  if (user) await handleEditCountry(req, res, user, pathParts[2]);
} else if (req.method === 'PUT' && pathParts[0] === 'admin' && pathParts[1] === 'edit-reservation' && pathParts.length === 3) {
  const user = await verifyToken(req, res);
  if (user) await handleEditReservation(req, res, user, pathParts[2]);
} else if (req.method === 'PUT' && pathParts[0] === 'admin' && pathParts[1] === 'edit-airport' && pathParts.length === 3) {
  const user = await verifyToken(req, res);
  if (user) await handleEditAirport(req, res, user, pathParts[2]);
} else if (req.method === 'PUT' && pathParts[0] === 'admin' && pathParts[1] === 'edit-flight' && pathParts.length === 3) {
  const user = await verifyToken(req, res);
  if (user) await handleEditFlight(req, res, user, pathParts[2]);
}



    
    else {
      sendError(res, 404, 'Not found');
    }
  } catch (error) {
    console.error('Server error:', error);
    sendError(res, 500, 'Internal server error');
  }
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});