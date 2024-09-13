const Workout = require('../models/Workout');

// Dodaj novi trening
exports.addWorkout = async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      trainerId: req.user._id // Pretpostavlja se da imate autentifikaciju i da je user dostupan
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Dobavi sve treninge za određenog trenera
exports.getWorkoutsByTrainer = async (req, res) => {
  try {
    const workouts = await Workout.find({ trainerId: req.user._id });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dobavi jedan trening prema ID-u
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ažuriraj trening
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obriši trening
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
