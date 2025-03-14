const express = require('express');
const router = express.Router();

const { createTravelInfo, getTravelInfoById } = require('../controllers/travelInfoController');

// POST: Create new travel info (calls Gemini & saves in DB)
router.post('/create-travel', createTravelInfo);

// GET: Fetch travel info by MongoDB ID
router.get('/get-travel/:id', getTravelInfoById);

module.exports = router;
