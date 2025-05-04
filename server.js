const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const destinacioneRouter = require('./destinacione'); // import routerin

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Krijo lidhje me databazen
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // ose ndonjë tjetër nëse ke vendosur username tjetër
    password: '', // ose vendos password nëse ke
    database: 'agjension_turistik'
});

// Lidhu me databazen
db.connect(err => {
    if (err) {
        console.error('Gabim në lidhje:', err);
        return;
    }
    console.log('✅ U lidh me databazën!');
});

// Bëje `db` të përdorshëm në router
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Import routes
app.use('/api/udhetimet', destinacioneRouter);

// Start server
app.listen(port, () => {
    console.log(`🚀 Serveri u startua në http://localhost:${port}`);
});
