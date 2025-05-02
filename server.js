const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3006;

// Krijo lidhje me databazën
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'destinacioni'
});

db.connect(err => {
  if (err) throw err;
  console.log('U lidhëm me databazën!');
});

// Ruta bazë
app.get('/', (req, res) => {
  res.send('Serveri po punon!');
});

// Ruta për të marrë të gjitha udhëtimet
app.get('/udhetimet', (req, res) => {
  db.query('SELECT * FROM udhetimet', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Starto serverin
app.listen(port, () => {
  console.log(`Serveri u startua në http://localhost:${port}`);
});

