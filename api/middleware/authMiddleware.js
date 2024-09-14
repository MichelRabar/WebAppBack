const jwt = require('jsonwebtoken');
const User = require('../models/usermodel'); // Putanja do vašeg modela korisnika

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Dohvati token i ukloni 'Bearer '

  if (!token) return res.status(401).send('Nema tokena. Autentifikacija je potrebna.');

  try {
    // Verifikacija tokena
    const decoded = jwt.verify(token, 'tajni_kljuc'); // Tajni ključ za JWT

    // Dohvati korisnika iz baze podataka
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).send('Nevažeći korisnik.');
    }

    // Dodaj trenerId u req objekat
    req.trenerId = user.trenerId;

    // Ako je sve u redu, nastavi dalje
    next();
  } catch (err) {
    console.error('Greška pri autentifikaciji:', err);
    res.status(401).send('Nevažeći token.');
  }
};

module.exports = authMiddleware;
