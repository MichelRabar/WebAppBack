const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal'); // Pretpostavlja se da imate Meal model
const jwt = require('jsonwebtoken'); // Ako koristite JWT za autentifikaciju

// POST /api/meals - Dodaj novi obrok
router.post('/', async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner, trenerid } = req.body;

    // Provjera da li su svi obavezni parametri prisutni
    if (!date || !breakfast || !lunch || !dinner || !trenerid) {
      return res.status(400).json({ message: 'Svi obavezni parametri su potrebni' });
    }

    // Kreiraj novi obrok
    const newMeal = new Meal({
      date,
      breakfast,
      lunch,
      dinner,
      trenerid
    });

    // Sačuvaj u bazi
    await newMeal.save();

    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Greška pri dodavanju obroka:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

// GET /api/meals - Dohvati obroke za određenog trenera
router.get('/', async (req, res) => {
  try {
    const { trenerid } = req.query;  // Izvlačimo trenerid iz query parametara
    if (!trenerid) {
      return res.status(400).json({ message: 'Trener ID je obavezan' });
    }

    // Pronađi obroke na osnovu trenerid
    const meals = await Meal.find({ trenerid });
    res.json(meals);
  } catch (error) {
    console.error('Greška pri dohvaćanju obroka:', error);
    res.status(500).json({ message: 'Greška pri dohvaćanju obroka', error });
  }
});

// PUT /api/meals/:id - Ažuriraj obrok
router.put('/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const { date, breakfast, lunch, dinner } = req.body;

    // Dobavi userId iz tokena (ako je dio JWT tokena)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Niste autorizovani.' });
    }

    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.userId;

    // Pronađi obrok po ID-u
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Obrok nije pronađen' });
    }

    // Proverite da li je userId isti kao trenerid
    if (meal.trenerid.toString() !== userId) {
      return res.status(403).json({ message: 'Nemate pravo da izvršite ovu izmenu' });
    }

    // Ažuriraj obrok
    const updateData = {
      date: date || meal.date,
      breakfast: breakfast || meal.breakfast,
      lunch: lunch || meal.lunch,
      dinner: dinner || meal.dinner
    };

    const updatedMeal = await Meal.findByIdAndUpdate(mealId, updateData, { new: true });

    res.json(updatedMeal);
  } catch (error) {
    console.error('Greška pri ažuriranju obroka:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

// GET /api/meals/:id - Dohvati pojedinačni obrok po ID-u
router.get('/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Obrok nije pronađen' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Greška pri dohvaćanju obroka:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

// DELETE /api/meals/:id - Izbriši obrok
router.delete('/:id', async (req, res) => {
  try {
    const mealId = req.params.id;
    const { userId } = req.body;

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Obrok nije pronađen' });
    }

    if (meal.trenerid.toString() !== userId) {
      return res.status(403).json({ message: 'Nemate pravo da izbrišete ovaj obrok' });
    }

    await Meal.findByIdAndDelete(mealId);
    res.status(204).send();
  } catch (error) {
    console.error('Greška pri brisanju obroka:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

module.exports = router;
