const express = require('express');
const File = require('../models/fileModel');
const fileController = require('./../controller/fileController');
const router = express.Router();

// Upload Rout
router.post('/', fileController.uploadUserFile, fileController.uploadFile);

// Upload Rout
router.post('/send', fileController.sendMail);

module.exports = router;
