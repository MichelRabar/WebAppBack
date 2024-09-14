const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  breakfast: { type: String, required: true },
  lunch: { type: String, required: true },
  dinner: { type: String, required: true },
  trenerid: { type: String, required: true } // Polje za trenerid
});

module.exports = mongoose.model('Meal', mealSchema);
