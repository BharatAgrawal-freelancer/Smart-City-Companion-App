const mongoose = require('mongoose');

const citySelectionSchema = new mongoose.Schema({
    email: { type: String, required: true }, // User email, reference point
    cities: [{ type: String, required: true }], // Array of cities user selected
}, { timestamps: true });

module.exports = mongoose.model('CitySelection', citySelectionSchema);
