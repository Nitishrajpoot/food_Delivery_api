const express = require('express');
const mongoose = require('mongoose');
const Food = require('../models/Food');

const router = express.Router();

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid food item id' });
  }
  next();
}

router.post('/', async (req, res, next) => {
  try {
    const { name, category, price, isAvailable } = req.body;
    const food = new Food({ name, category, price, isAvailable });
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/available', async (req, res, next) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const { name, category, price, isAvailable } = req.body;
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { name, category, price, isAvailable },
      { new: true, runValidators: true }
    );
    if (!updatedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(updatedFood);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
