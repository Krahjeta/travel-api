const express = require('express');
const router = express.Router();

//Mock data
let destinacione = [
    {id: 1, emri: 'Paris', pershkrimi: 'Qyteti i dashurise', qmimi: 500.00},
    {id: 2, emri: 'Roma', pershkrimi: 'Qyteti i perjetshem', qmimi:450.00}
];

//GET /destinacione
router.get('/' , (req, res) => {
    res.json(destinacione);
});

// GET /destinacione/:id
router.get('/:id', (req, res) => {
    const d = destinacione.find(x => x.id == req.params.id);
    if (d) res.json(d);
    else res.status(404).json({ message: 'Destinacioni nuk u gjet' });
  });
  
// POST /destinacione
router.post('/', (req, res) => {
    const newD = { id: destinacione.length + 1, ...req.body };
    destinacione.push(newD);
    res.status(201).json(newD);
  });

// PUT /destinacione/:id
router.put('/:id', (req, res) => {
    const index = destinacione.findIndex(x => x.id == req.params.id);
    if (index !== -1) {
      destinacione[index] = { id: parseInt(req.params.id), ...req.body };
      res.json(destinacione[index]);
    } else {
      res.status(404).json({ message: 'Destinacioni nuk u gjet' });
    }
});

// DELETE /destinacione/:id
router.delete('/:id', (req, res) => {
    const index = destinacione.findIndex(x => x.id == req.params.id);
    if (index !== -1) {
      const deleted = destinacione.splice(index, 1);
      res.json(deleted[0]);
    } else {
      res.status(404).json({ message: 'Destinacioni nuk u gjet' });
    }
  });
  
module.exports = router;