const axios = require('axios');
require('dotenv').config();
const { TravelInfo } = require('../models/travelInfoModel');

const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const apiKey = process.env.GOOGLE_API_KEY;

// ======================================
// ✅ Create & Save Travel Info (POST API)
// ======================================
async function createTravelInfo(req, res) {
  const { country, city, currentLocation, destination } = req.body;

  const prompt = `
    Give me travel information between "${currentLocation}" and "${destination}" in "${country}". Include:
    - Distance between locations
    - Ideal time to travel
    - Available vehicles (Train, Bus, etc.)
    - Name of trains or buses with timings
    
    Return response in JSON like:
    {
      "distance": "XXX km",
      "idealTime": "X hours",
      "vehicles": [
        {
          "type": "Train",
          "name": "Rajdhani Express",
          "timings": "10:00 AM - 5:00 PM"
        },
        {
          "type": "Bus",
          "name": "Volvo AC Bus",
          "timings": "9:00 AM - 2:00 PM"
        }
      ]
    }
  `;

  const requestData = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(`${apiUrl}?key=${apiKey}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    let textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let cleanedText = textContent
      .replace(/^```json/, '')
      .replace(/```$/, '')
      .trim();

    const lastClosingBraceIndex = cleanedText.lastIndexOf('}');
    if (lastClosingBraceIndex !== -1) {
      cleanedText = cleanedText.substring(0, lastClosingBraceIndex + 1);
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);

      const newTravelInfo = new TravelInfo({
        country,
        city,
        currentLocation,
        destination,
        distance: parsedResponse.distance,
        idealTime: parsedResponse.idealTime,
        vehicles: parsedResponse.vehicles
      });

      const savedTravelInfo = await newTravelInfo.save();

      console.log(`✅ Travel info saved! ID: ${savedTravelInfo._id}`);

      return res.status(201).json({
        success: true,
        id: savedTravelInfo._id
      });

    } catch (error) {
      console.error("❌ JSON Parse Error:", error);
      return res.status(500).json({
        success: false,
        message: "JSON parsing failed",
        error: error.message
      });
    }

  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Gemini API call failed",
      error: error.message
    });
  }
}

// ======================================
// ✅ Get Travel Info by ID (GET API)
// ======================================
async function getTravelInfoById(req, res) {
  const id = req.params.id;

  try {
    const travelInfo = await TravelInfo.findById(id);

    if (!travelInfo) {
      return res.status(404).json({
        success: false,
        message: 'No travel info found for this ID'
      });
    }

    return res.status(200).json({
      success: true,
      data: travelInfo
    });

  } catch (error) {
    console.error("❌ Get Travel Info Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

module.exports = {
  createTravelInfo,
  getTravelInfoById
};
