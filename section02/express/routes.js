const express = require('express');
const router = express.Router();
const data = require('./data');

function showTimestamp(req, res, next) {
  console.log(`Request time: ${(new Date).toLocaleString()}`);
  next();
}

router
  .route('/')
  .get(showTimestamp, (req, res) => res.status(200).json(data.property))
  .post((req, res) => res.send('HTTP POST example'));

module.exports = {
  router
};