const CitySelection = require('../models/citySelection');

exports.saveCitySelection = async (req, res) => {
    try {
        const { email, cities } = req.body;

        if (!email || !cities || !Array.isArray(cities)) {
            return res.status(400).json({ error: "Email and cities array are required" });
        }

        // Save or update cities for the user
        const existingRecord = await CitySelection.findOne({ email });

        if (existingRecord) {
            // Append new cities, avoid duplicates (optional)
            const updatedCities = Array.from(new Set([...existingRecord.cities, ...cities]));

            existingRecord.cities = updatedCities;
            await existingRecord.save();

            return res.json({ message: "Cities updated successfully", data: existingRecord });
        } else {
            // Create a new record
            const newRecord = new CitySelection({ email, cities });
            await newRecord.save();

            return res.json({ message: "Cities saved successfully", data: newRecord });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while saving cities" });
    }
};


// ✅ GET: Fetch selected cities by email
exports.getCitySelection = async (req, res) => {
    try {
        const { email } = req.body; // Sending in body, no query param

        if (!email) {
            return res.status(400).json({ error: "Email is required to fetch city selections" });
        }

        const record = await CitySelection.findOne({ email });

        if (!record) {
            return res.status(404).json({ message: "No cities found for this user." });
        }

        return res.json({ message: "Cities fetched successfully", data: record.cities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while fetching cities" });
    }
};