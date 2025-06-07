const http = require('http');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travelagency',
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

// Convert "MM/DD/YYYY" or "DD/MM/YYYY" to "YYYY-MM-DD"
function formatDateToMySQL(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  // Handle both MM/DD/YYYY and DD/MM/YYYY — adjust according to your frontend
  const [part1, part2, year] = parts.map(p => parseInt(p));
  const month = part1 > 12 ? part2 : part1;
  const day = part1 > 12 ? part1 : part2;

  const formatted = new Date(year, month - 1, day);
  return isNaN(formatted.getTime()) ? null : formatted.toISOString().split('T')[0];
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/search-flights') {
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

      db.query(sql, params, (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return sendJSON(res, 500, { error: 'Database error' });
        }
        sendJSON(res, 200, results);
      });
    } catch (error) {
      sendJSON(res, 400, { error: error.message });
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


