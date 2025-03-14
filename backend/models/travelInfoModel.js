const mongoose = require('mongoose');

const travelInfoSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  currentLocation: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: String },
  idealTime: { type: String },
  vehicles: [
    {
      type: { type: String }, // Train, Bus, etc.
      name: { type: String },  // Name of train/bus
      timings: { type: String } // Timings or schedule
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const TravelInfo = mongoose.model('TravelInfo', travelInfoSchema);

module.exports = { TravelInfo };
