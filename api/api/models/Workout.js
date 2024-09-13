const mongoose = require('mongoose');

// Definirajte schema za treninge
const workoutSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // Trajanje u minutama
    required: true
  },
  description: {
    type: String,
    default: '' // Opis treninga
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Pretpostavlja se da imate model 'User' za trenera
    required: true
  }
}, {
  timestamps: true // Automatski dodaje 'createdAt' i 'updatedAt' polja
});

// Kreirajte model iz schema
module.exports = mongoose.model('Workout', workoutSchema);
