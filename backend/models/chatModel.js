const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  inputText: { type: String, required: true },
  translatedText: { type: String, required: true },
  sourceLang: { type: String, default: 'auto' },
  targetLang: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
