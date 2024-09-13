const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const jwt = require('jsonwebtoken'); // Ako koristiš JWT za autentifikaciju

// POST /api/workouts - Dodaj novi trening
router.post('/', async (req, res) => {
  try {
    const { date, type, duration, description, trainerId } = req.body;
    
    // Provera da li su svi obavezni parametri prisutni
    if (!date || !type || !duration || !trainerId) {
      return res.status(400).json({ message: 'Svi obavezni parametri su potrebni' });
    }

    // Kreiraj novi trening
    const newWorkout = new Workout({
      date,
      type,
      duration,
      description,
      trainerId
    });

    // Sačuvaj u bazi
    await newWorkout.save();

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Greška pri dodavanju treninga:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

// GET /api/workouts - Dohvati treninge za određenog trenera
router.get('/', async (req, res) => {
  try {
    const { trainerId } = req.query;  // Izvlačimo trainerId iz query parametara
    if (!trainerId) {
      return res.status(400).json({ message: 'Trener ID je obavezan' });
    }

    // Pronađi treninge na osnovu trainerId
    const workouts = await Workout.find({ trainerId });
    res.json(workouts);
  } catch (error) {
    console.error('Greška pri dohvaćanju treninga:', error);
    res.status(500).json({ message: 'Greška pri dohvaćanju treninga', error });
  }
});
// PUT /api/workouts/:id - Ažuriraj trening
router.put('/:id', async (req, res) => {
    try {
      const workoutId = req.params.id;
      const { date, type, duration, description } = req.body;
  
      // Dobavi userId iz tokena (ako je deo JWT tokena)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Niste autorizovani.' });
      }
      
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const userId = decoded.userId;
  
      // Pronađi trening po ID-u
      const workout = await Workout.findById(workoutId);
      if (!workout) {
        return res.status(404).json({ message: 'Trening nije pronađen' });
      }
  
      // Proverite da li je userId isti kao trainerId
      if (workout.trainerId.toString() !== userId) {
        return res.status(403).json({ message: 'Nemate pravo da izvršite ovu izmenu' });
      }
  
      // Ažuriraj trening
      const updateData = {
        date: date || workout.date,
        type: type || workout.type,
        duration: duration || workout.duration,
        description: description || workout.description
      };
  
      console.log('Update data:', updateData); // Logovanje za debagovanje
  
      const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, updateData, { new: true });
      
      res.json(updatedWorkout);
    } catch (error) {
      console.error('Greška pri ažuriranju treninga:', error);
      res.status(500).json({ message: 'Greška na serveru' });
    }
  });
  

// GET /api/workouts/:id - Dohvati pojedinačni trening po ID-u
router.get('/:id', async (req, res) => {
  try {
    const workoutId = req.params.id;
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Trening nije pronađen' });
    }
    res.json(workout);
  } catch (error) {
    console.error('Greška pri dohvaćanju treninga:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

// DELETE /api/workouts/:id - Izbriši trening
router.delete('/:id', async (req, res) => {
  try {
    const workoutId = req.params.id;
    const { userId } = req.body;

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Trening nije pronađen' });
    }

    if (workout.trainerId.toString() !== userId) {
      return res.status(403).json({ message: 'Nemate pravo da izbrišete ovaj trening' });
    }

    await Workout.findByIdAndDelete(workoutId);
    res.status(204).send();
  } catch (error) {
    console.error('Greška pri brisanju treninga:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
});

module.exports = router;
