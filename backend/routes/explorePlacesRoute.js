const express = require('express');
const router = express.Router();
const { fetchExplorePlaces, getExplorePlaceById } = require('../controllers/explorePlacesController');

// ✅ Route 1: Create and Save (call this on frontend form submit)
router.post('/', async (req, res) => {
  const { city } = req.body;

  try {
    const result = await fetchExplorePlaces(city);
    res.status(200).json({
      success: true,
      message: 'Explore places data generated and saved!',
      id: result.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ Route 2: Fetch by ID
router.get('/:id', getExplorePlaceById);

module.exports = router;
