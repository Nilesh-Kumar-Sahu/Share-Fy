const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');

const corsOptions = {
  // origin: process.env.ALLOWED_CLIENTS.split(','),
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
  origin: '*',
  credential: true,
};

app.use(cors(corsOptions));

// Middleware - if anybody sends JSON data then this below line will
// basically parse the json data
app.use(express.json());

// Setting Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// Telling express the path of our static folder
app.use(express.static(path.join(__dirname, 'public')));

// 2) ROUTER
app.get('/', (req, res) => {
  res.status(200).render('landing');
});

// Upload file and send mail Rout
app.use('/api/files', require('./routes/files'));

// Show download link Page
app.use('/files', require('./routes/show'));
// http://localhost:5000/files/e31a5347-20e6-45eb-89b8-a470bbe4bf02

// Download Link Rout
app.use('/files/download', require('./routes/download'));

module.exports = app;
