const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Serveri po punon!');
});

app.listen(port, () => {
  console.log(`Serveri u startua në http://localhost:${3000}`);
});
