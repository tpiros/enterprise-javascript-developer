const express = require('express');
const app = express();
const routes = require('./routes');

app.use('/api', routes.router);

// app
//   .get('/', (req, res) => res.send('Hello Express!'))
//   .post('/', (req, res) => res.send('HTTP POST example'));

app.listen(3000, () => console.log('Server running on port 3000'));