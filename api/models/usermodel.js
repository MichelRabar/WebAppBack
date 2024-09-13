const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ime: String,
  prezime: String,
  visina: Number,
  kilaza: Number,
  zdrastveniProblemi: String,
  lozinka: String,
  username: { type: String, unique: true },
  slika: { type: String, default: '' },
  jeTrener: { type: Boolean, default: false },
  trenerid: { type: String , default:'' }, // Dodano trenerId polje
});

module.exports = mongoose.model('User', userSchema);
