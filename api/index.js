const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./api/route/userroute'); // Putanja do vaše rute za korisnike
const mealRoutes = require('./api/route/mealRoutes'); // Putanja do vaše rute za obroke
const { getTrenerId } = require('./api/middleware/trenerService'); // Import trenerService
const workoutRoutes = require('./api/route/workoutRoutes');

const app = express();

// Omogućavanje CORS-a za sve domene
app.use(cors({
  origin: 'http://localhost:8080', // Zamijenite s URL-om vašeg frontend-a
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware za parsiranje JSON tela
app.use(express.json());

// Middleware za parsiranje URL-encoded podataka
app.use(express.urlencoded({ extended: true }));
// Endpoint za dodavanje obroka




// Rute
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);


// Middleware za serviranje statičkih fajlova (slike)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konekcija sa MongoDB
const db = require('./config/db');
mongoose.connect(db.database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


  const Trainer = mongoose.model('user', new mongoose.Schema({
    trenerId: String,
    // ostala polja
  }));
  
 
// Pokretanje servera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
