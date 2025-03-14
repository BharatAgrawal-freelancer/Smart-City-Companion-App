const express = require('express');
const router = express.Router();
const { getCityImages } = require('../controllers/pixabayController');

// POST route for photos
router.post('/', getCityImages);

module.exports = router;
