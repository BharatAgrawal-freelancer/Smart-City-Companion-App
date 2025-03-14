const Chat = require('../models/chatModel');
const axios = require('axios');

const translateAndSave = async (req, res) => {
  const { inputText, targetLang } = req.body;

  if (!inputText || !targetLang) {
    return res.status(400).json({ success: false, message: 'Missing inputText or targetLang' });
  }

  try {
    // 🔹 LibreTranslate API Call
    const response = await axios.post("https://libretranslate.com/translate", {
      q: inputText,
      source: "auto",
      target: targetLang,
      format: "text",
      alternatives: 3,
      api_key: "jhfauerfewohfdjfdhfuo"
    }, {
      headers: { "Content-Type": "application/json" }
    });

    const translatedText = response.data.translatedText;

    // 🔹 Save to MongoDB
    const newChat = new Chat({
      inputText,
      translatedText,
      sourceLang: "auto",
      targetLang
    });

    const savedChat = await newChat.save();

    res.status(200).json({ success: true, data: savedChat });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ success: false, message: 'Translation failed', error: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chat history', error: error.message });
  }
};

module.exports = {
  translateAndSave,
  getAllChats
};
