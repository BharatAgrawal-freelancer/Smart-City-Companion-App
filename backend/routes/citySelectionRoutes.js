const express = require('express');
const router = express.Router();
const citySelectionController = require('../controllers/citySelectionController');

// Route for saving city selections
router.post('/save-cities', citySelectionController.saveCitySelection);
router.post('/get-cities', citySelectionController.getCitySelection);

module.exports = router;
