const express = require('express');
const router = express.Router();
const { translateAndSave, getAllChats } = require('../controllers/chatController');

// 🔹 Translate & Save
router.post('/translate', translateAndSave);

// 🔹 Get all chat history
router.get('/chats', getAllChats);

module.exports = router;
