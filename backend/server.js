const http = require('http');
const mysql = require('mysql');
const url = require('url');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelAgency"
});

db.connect(err => {
  if (err) {
    console.error("Failed to connect to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database.");
  }
});

function setHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseRequestBody(req) {
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

const server = http.createServer(async (req, res) => {
  setHeaders(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  try {
    if (req.method === 'POST' && parsedUrl.pathname === '/signup') {
      const { name, email, password, role = 'user' } = await parseRequestBody(req);
      const sql = "INSERT INTO login (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, password, role], (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Signup successful" }));
      });

    } else if (req.method === 'POST' && parsedUrl.pathname === '/signin') {
      const { email, password } = await parseRequestBody(req);
      const sql = "SELECT id, name, email, role FROM login WHERE email = ? AND password = ?";
      db.query(sql, [email, password], (err, results) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
        if (results.length === 0) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid credentials" }));
        }
        const user = results[0];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }));
      });

    } else if (req.method === 'GET' && parsedUrl.pathname === '/offers') {
      const sql = "SELECT * FROM offers";
      db.query(sql, (err, results) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      });

    } else if (req.method === 'POST' && parsedUrl.pathname === '/add-offer') {
      const { city, type, departureDate, departureTime, landingDate, landingTime, price } = await parseRequestBody(req);
      const sql = `
        INSERT INTO offers (city, type, departureDate, departureTime, landingDate, landingTime, price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [city, type, departureDate, departureTime, landingDate, landingTime, price], (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }

        // Return the inserted offer with its new ID
        const createdOffer = {
          id: result.insertId,
          city,
          type,
          departureDate,
          departureTime,
          landingDate,
          landingTime,
          price
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(createdOffer));
      });

    } else if (req.method === 'DELETE' && parsedUrl.pathname === '/delete-offer') {
      const id = parsedUrl.query.id;
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing offer id' }));
      }

      const sql = "DELETE FROM offers WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
        if (result.affectedRows === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Offer not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Offer deleted successfully' }));
      });

    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("Not Found");
    }
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
