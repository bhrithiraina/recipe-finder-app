const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);


// Sample API route to search meals
app.get('/api/recipes/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
