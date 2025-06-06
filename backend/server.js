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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
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

function sendJSON(res, statusCode, data) {
  const payload = JSON.stringify(data);
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
    if (!verifyAdmin(user, res)) return;

    const {
      city, type, departureDate, departureTime,
      landingDate, landingTime, price,
      availableSeats = 0, image = ''
    } = await parseJSONBody(req);

    if (!city || !type || !departureDate || !departureTime || !landingDate || !landingTime || !price) {
      return sendError(res, 400, 'Missing offer fields');
    }

    const sql = `INSERT INTO offers 
      (city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await queryAsync(sql, [city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image]);

    sendJSON(res, 201, { id: result.insertId, city, type, departureDate, departureTime, landingDate, landingTime, price, availableSeats, image });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}

async function handleDeleteOffer(req, res, user, offerId) {
  try {
    if (!verifyAdmin(user, res)) return;

    const result = await queryAsync('DELETE FROM offers WHERE id = ?', [offerId]);
    if (result.affectedRows === 0) return sendError(res, 404, 'Offer not found');

    sendJSON(res, 200, { message: 'Offer deleted successfully' });
  } catch (err) {
    sendError(res, 500, err.message);
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

    // Insert with paid = 0 initially
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
      `SELECT r.id, r.numSeats, r.paid, o.city, o.type, o.departureDate, o.departureTime, o.price 
       FROM reservations r 
       JOIN offers o ON r.offerId = o.id 
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

    // Verify reservation belongs to user and is unpaid
    const results = await queryAsync(
      'SELECT paid FROM reservations WHERE id = ? AND userId = ?',
      [reservationId, user.id]
    );
    if (results.length === 0) return sendError(res, 404, 'Reservation not found');
    if (results[0].paid === 1) return sendError(res, 400, 'Reservation already paid');

    await queryAsync('UPDATE reservations SET paid = 1 WHERE id = ?', [reservationId]);

    sendJSON(res, 200, { message: 'Payment successful' });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}

async function handleCancelReservation(req, res, user) {
  try {
    const { reservationId } = await parseJSONBody(req);
    if (!reservationId) return sendError(res, 400, 'Missing reservationId');

    // Check reservation belongs to user and is unpaid
    const results = await queryAsync(
      'SELECT paid, offerId, numSeats FROM reservations WHERE id = ? AND userId = ?',
      [reservationId, user.id]
    );
    if (results.length === 0) return sendError(res, 404, 'Reservation not found');
    if (results[0].paid === 1) return sendError(res, 400, 'Cannot cancel a paid reservation');

    // Delete reservation
    await queryAsync('DELETE FROM reservations WHERE id = ?', [reservationId]);

    // Restore seats
    await queryAsync(
      'UPDATE offers SET availableSeats = availableSeats + ? WHERE id = ?',
      [results[0].numSeats, results[0].offerId]
    );

    sendJSON(res, 200, { message: 'Reservation cancelled successfully' });
  } catch (error) {
    sendError(res, 400, error.message);
  }
}

// ====== SERVER ======
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

  try {
    if (req.method === 'POST' && parsedUrl.pathname === '/signup') return handleSignup(req, res);
    if (req.method === 'POST' && parsedUrl.pathname === '/signin') return handleSignin(req, res);
     if (req.method === 'POST' && parsedUrl.pathname === '/search-flights') return handleSearchFlights(req, res);
    if (req.method === 'GET' && parsedUrl.pathname === '/offers') return handleGetOffers(req, res);
    if (req.method === 'GET' && pathParts[0] === 'offers' && pathParts.length === 2) {
      return handleGetSingleOffer(req, res, pathParts[1]);
    }

    const user = await verifyToken(req, res);
    if (!user) return;

    if (req.method === 'POST' && parsedUrl.pathname === '/add-offer') return handleAddOffer(req, res, user);
    if (req.method === 'DELETE' && pathParts[0] === 'delete-offer' && pathParts.length === 2) {
      return handleDeleteOffer(req, res, user, pathParts[1]);
    }
    if (req.method === 'POST' && parsedUrl.pathname === '/reserve') return handleReserve(req, res, user);
    if (req.method === 'GET' && parsedUrl.pathname === '/reservations') return handleGetReservations(req, res, user);

    // New endpoints
    if (req.method === 'POST' && parsedUrl.pathname === '/pay-reservation') return handlePayReservation(req, res, user);
    if (req.method === 'POST' && parsedUrl.pathname === '/cancel-reservation') return handleCancelReservation(req, res, user);

    sendError(res, 404, 'Not Found');
  } catch (err) {
    sendError(res, 500, err.message || 'Internal Server Error');
  }
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

