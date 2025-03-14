const mongoose = require('mongoose');

const explorePlaceSchema = new mongoose.Schema({
  city: { type: String, required: true },
  famous_places: [String],
  cultural_experiences: [String],
  festivals: [String],
  traditional_workshops: [String],
  dance_music_shows: [String],
  community_villages: [String],
  religious_ceremonies: [String],
  additional_info: String
}, { timestamps: true });

const ExplorePlace = mongoose.model('ExplorePlace', explorePlaceSchema);

module.exports = { ExplorePlace };
