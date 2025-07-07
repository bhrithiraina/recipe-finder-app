const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Add to favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const recipe = req.body;
    const alreadyAdded = user.favorites.find(r => r.idMeal === recipe.idMeal);
    if (alreadyAdded) return res.status(400).json({ message: 'Already added' });

    user.favorites.push(recipe);
    await user.save();
    res.json({ message: 'Recipe added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get favorites
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Remove from favorites
router.delete('/favorites/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(r => r.idMeal !== req.params.id);
    await user.save();
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
