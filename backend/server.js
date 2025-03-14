const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // CORS bhi require kar le
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const citySelectionRoutes = require('./routes/citySelectionRoutes');
const pixaRoute = require('./routes/imageRoutes');
const explorePlacesRoute = require('./routes/explorePlacesRoute');
const travelInfoRoutes = require('./routes/travelInfoRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
connectDB();

const app = express(); // 👈 Yeh pehle aayega

// CORS options
const corsOptions = {
  origin: 'http://127.0.0.1:5500',  // Frontend ka origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Agar cookies ya headers bhejne ho to
};

// Middlewares
app.use(cors(corsOptions)); // 👈 Yeh ab sahi jagah pe hai
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('🏥 HMS API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/cities', citySelectionRoutes);
app.use('/api/photo', pixaRoute);
app.use('/api/explore', explorePlacesRoute);
app.use('/api/travel', travelInfoRoutes);
app.use('/api', chatRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
