const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const { ExplorePlace } = require('../models/explorePlacesModel'); // ✅ Import ExplorePlace model

const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const apiKey = process.env.GOOGLE_API_KEY;

// ===============================
// ✅ Controller 1: Create & Save
// ===============================
async function fetchExplorePlaces(cityName) {
  const prompt = `
    Provide a detailed travel guide for the city "${cityName}" focusing on:
    - Cultural & Local Experiences
    - Festivals & Fairs
    - Traditional Art & Craft Workshops
    - Dance / Music Shows
    - Local Community Villages
    - Religious Ceremonies
    
    Return the response in this JSON format:
    {
      "city": "${cityName}",
      "famous_places": ["Place 1", "Place 2", "Place 3"],
      "cultural_experiences": ["Experience 1", "Experience 2"],
      "festivals": ["Festival 1", "Festival 2"],
      "traditional_workshops": ["Workshop 1", "Workshop 2"],
      "dance_music_shows": ["Show 1", "Show 2"],
      "community_villages": ["Village 1", "Village 2"],
      "religious_ceremonies": ["Ceremony 1", "Ceremony 2"],
      "additional_info": "Any other important information for tourists."
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

      // ✅ Create and save to MongoDB
      const newExplorePlace = new ExplorePlace(parsedResponse);
      const savedPlace = await newExplorePlace.save();

      console.log(`✅ Explore Places for "${cityName}" saved to database! ID: ${savedPlace._id}`);

      // ✅ Optional: Save locally as JSON file for reference
      fs.writeFileSync(`explore-${cityName}.json`, JSON.stringify(parsedResponse, null, 2));
      console.log('✅ Response saved to explore-' + cityName + '.json');

      // ✅ Return only the ID
      return { id: savedPlace._id };

    } catch (error) {
      console.error("❌ Error parsing JSON response:", error);
      throw error;
    }

  } catch (error) {
    console.error("❌ Error making API request:", error.response?.data || error.message);
    throw error;
  }
}

// ===============================
// ✅ Controller 2: Get by ID API
// ===============================
async function getExplorePlaceById(req, res) {
  const id = req.params.id;

  try {
    const placeData = await ExplorePlace.findById(id);

    if (!placeData) {
      return res.status(404).json({
        success: false,
        message: 'No data found with the provided ID.'
      });
    }

    return res.status(200).json({
      success: true,
      data: placeData
    });

  } catch (error) {
    console.error("❌ Error fetching data by ID:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}

module.exports = {
  fetchExplorePlaces,  // ✅ POST call karta hai Gemini API pe aur save karta hai DB me
  getExplorePlaceById  // ✅ GET call karta hai aur ID ke hisaab se data laata hai
};
