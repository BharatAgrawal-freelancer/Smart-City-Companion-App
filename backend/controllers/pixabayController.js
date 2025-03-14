const axios = require('axios');

// Pixabay API key and base URL
const PIXABAY_API_KEY = '49316192-0480298a4d9d50fd6930e3e58';
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

// Controller Function
const getCityImages = async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(`${PIXABAY_BASE_URL}`, {
      params: {
        key: PIXABAY_API_KEY,
        q: city,
        image_type: 'photo',
        per_page: 4, // only 4 images
      },
    });

    const hits = response.data.hits;

    // Map the hits to return only image URLs
    const images = hits.map((img) => ({
      previewURL: img.previewURL,
      webformatURL: img.webformatURL,
      largeImageURL: img.largeImageURL,
    }));

    return res.json({
      city: city,
      images: images,
    });

  } catch (error) {
    console.error('Error fetching images:', error.message);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
};

module.exports = { getCityImages };
