const express = require('express');
const router = express.Router();

// GET të gjitha udhetimet
router.get('/', (req, res) => {
    const sql = `
        SELECT u.id, u.data_nisjes, u.qmimi, d.emri AS destinacion_emri
        FROM udhetimet u
        JOIN destinacione d ON u.destinacion_id = d.id
    `;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Gabim në marrje të të dhënave:', err);
            return res.status(500).json({ error: 'Gabim në server' });
        }
        res.json(results);
    });
});

// POST udhetim i ri
router.post('/', (req, res) => {
    const { destinacion_id, data_nisjes, qmimi } = req.body;
    const sql = `INSERT INTO udhetimet (destinacion_id, data_nisjes, qmimi) VALUES (?, ?, ?)`;
    req.db.query(sql, [destinacion_id, data_nisjes, qmimi], (err, result) => {
        if (err) {
            console.error('Gabim në shtim:', err);
            return res.status(500).json({ error: 'Gabim në server' });
        }
        res.status(201).json({ message: 'Udhetimi u shtua me sukses!', id: result.insertId });
    });
});

// PUT (update) udhetim
router.put('/:id', (req, res) => {
    const { destinacion_id, data_nisjes, qmimi } = req.body;
    const sql = `
        UPDATE udhetimet
        SET destinacion_id = ?, data_nisjes = ?, qmimi = ?
        WHERE id = ?
    `;
    req.db.query(sql, [destinacion_id, data_nisjes, qmimi, req.params.id], (err) => {
        if (err) {
            console.error('Gabim në update:', err);
            return res.status(500).json({ error: 'Gabim në server' });
        }
        res.json({ message: 'Udhetimi u përditësua me sukses!' });
    });
});

// DELETE udhetim
router.delete('/:id', (req, res) => {
    const sql = `DELETE FROM udhetimet WHERE id = ?`;
    req.db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.error('Gabim në fshirje:', err);
            return res.status(500).json({ error: 'Gabim në server' });
        }
        res.json({ message: 'Udhetimi u fshi me sukses!' });
    });
});

module.exports = router;
