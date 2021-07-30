const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// ==========Middlewares==========
// Parse the json data
app.use(express.json());

//Setting the request's mode to 'no-cors'
const corsOptions = {
  origin: '*',
  credential: true,
};
app.use(cors(corsOptions));

// Setting Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// Telling express the path of our static folder
app.use(express.static(path.join(__dirname, 'public')));

// 2) ROUTER
// Landing Page
app.get('/', (req, res) => {
  res.status(200).render('landing');
});

// Upload file and send mail
app.use('/api/files', require('./routes/files'));

// Show download link Page
app.use('/files', require('./routes/show'));

// Download Link Rout
app.use('/files/download', require('./routes/download'));

module.exports = app;
