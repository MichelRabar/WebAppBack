const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/usermodel'); // Prilagodite putanju prema vašoj strukturi
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Projeri da li postoji folder 'uploads', ako ne, kreirajte ga
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Konfiguracija za Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder gde će se čuvati slike
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unikatan naziv slike
  }
});

const upload = multer({ storage: storage });

// Omogućavanje CORS-a za ovu rutu
router.use(cors({
  origin: 'http://localhost:8080', // Zamijenite sa domenom vašeg frontenda
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Registracija korisnika
router.post('/register', upload.single('slika'), async (req, res) => {
  try {
    const { ime, prezime, visina, kilaza, zdrastveniProblemi, lozinka, username } = req.body;
    const slika = req.file ? req.file.path : ''; // Putanja do slike

    // provjera ulaznih podataka
    if (!ime || !prezime || !username || !lozinka) {
      return res.status(400).json({ message: 'Svi obavezni podaci moraju biti popunjeni.' });
    }

    // Hashovanje lozinke pre čuvanja u bazi
    const hashedLozinka = await bcrypt.hash(lozinka, 10);

    // Kreiranje novog korisnika
    const newUser = new User({
      ime,
      prezime,
      visina,
      kilaza,
      zdrastveniProblemi,
      lozinka: hashedLozinka,
      username,
      slika
    });

    await newUser.save();

    res.status(201).json({ message: 'Korisnik je uspešno registrovan.' });
  } catch (error) {
    console.error('Greška pri registraciji korisnika:', error);
    res.status(500).json({ message: 'Greška pri registraciji korisnika.' });
  }
});

// Login korisnika
router.post('/login', async (req, res) => {
  try {
    const { username, lozinka } = req.body;

    // Validacija ulaznih podataka
    if (!username || !lozinka) {
      return res.status(400).json({ message: 'Svi obavezni podaci moraju biti popunjeni.' });
    }

    // Pronaći korisnika u bazi
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Korisničko ime ili lozinka nisu ispravni.' });
    }

    // Provejera da li lozinka odgovara
    const isMatch = await bcrypt.compare(lozinka, user.lozinka);
    if (!isMatch) {
      return res.status(401).json({ message: 'Korisničko ime ili lozinka nisu ispravni.' });
    }

    // Generisanje JWT tokena
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Uspešna prijava.', token });
  } catch (error) {
    console.error('Greška pri prijavi korisnika:', error);
    res.status(500).json({ message: 'Greška pri prijavi korisnika.' });
  }
});

// Ruta za preuzimanje profila
router.get('/profile', async (req, res) => {
  try {
    // Pretpostavljamo da korisnik dolazi iz JWT tokena, tako da uzimamo id korisnika iz tokena
    const token = req.headers.authorization?.split(' ')[1]; // Pretpostavljamo da je token u formatu "Bearer token"
    if (!token) {
      return res.status(401).json({ message: 'Niste autorizovani.' });
    }
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.userId;

    // Pronaći korisnika u bazi
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Vratiti korisničke podatke i putanju do slike
    res.status(200).json(user);
  } catch (error) {
    console.error('Greška pri preuzimanju profila:', error);
    res.status(500).json({ message: 'Greška pri preuzimanju profila.' });
  }
});
// Ruta za preuzimanje profila
router.get('/meals', async (req, res) => {
  try {
    // Pretpostavljamo da korisnik dolazi iz JWT tokena, tako da uzimamo id korisnika iz tokena
    const token = req.headers.authorization?.split(' ')[1]; // Pretpostavljamo da je token u formatu "Bearer token"
    if (!token) {
      return res.status(401).json({ message: 'Niste autorizovani.' });
    }
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.userId;

    // Pronaći korisnika u bazi
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Vratiti korisničke podatke i putanju do slike
    res.status(200).json(user);
  } catch (error) {
    console.error('Greška pri preuzimanju profila:', error);
    res.status(500).json({ message: 'Greška pri preuzimanju profila.' });
  }
});

// Ruta za preuzimanje slike
router.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  res.sendFile(filePath);
});

// Ruta za preuzimanje trenerId na osnovu username
router.get('/trenerId/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select('trenerId');

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen' });
    }

    res.json({ trenerId: user.trenerId || '' });
  } catch (error) {
    console.error('Greška pri dohvaćanju trenerId:', error.message);
    res.status(500).json({ message: 'Greška pri dohvaćanju trenerId' });
  }
});

// Ruta za dobijanje svih korisnika
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Dohvata sve korisnike iz baze
    res.json(users); // Vraća sve korisnike kao JSON
  } catch (error) {
    console.error('Greška pri dobijanju korisnika:', error);
    res.status(500).json({ message: 'Greška pri dobijanju korisnika.' });
  }
});
// Ruta za ažuriranje profila korisnika
router.put('/profile', upload.single('slika'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Niste autorizovani.' });
    }

    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.userId;

    // Pronađite korisnika po ID-u
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Ažurirajte polja sa novim vrednostima iz zahteva
    user.ime = req.body.ime || user.ime;
    user.prezime = req.body.prezime || user.prezime;
    user.visina = req.body.visina || user.visina;
    user.kilaza = req.body.kilaza || user.kilaza;
    user.zdrastveniProblemi = req.body.zdrastveniProblemi || user.zdrastveniProblemi;

    // Ako postoji nova slika, ažurirajte putanju slike
    if (req.file) {
      // Brisanje stare slike ako postoji
      if (user.slika) {
        fs.unlink(user.slika, (err) => {
          if (err) console.error('Greška pri brisanju stare slike:', err);
        });
      }
      user.slika = req.file.path;
    }

    // Sačuvajte ažuriranog korisnika u bazu
    await user.save();

    res.json({ message: 'Profil uspešno ažuriran.', user });
  } catch (error) {
    console.error('Greška pri ažuriranju profila:', error);
    res.status(500).json({ message: 'Greška pri ažuriranju profila.' });
  }
});



router.get('/trainers', async (req, res) => {
  try {
    const trainers = await User.find({ jeTrener: true }); // Filtriranje prema 'jeTrener'
    res.json(trainers);
  } catch (error) {
    console.error('Greška pri dobijanju trenera:', error);
    res.status(500).json({ message: 'Greška pri dobijanju trenera.' });
  }
});

// Eksportovanje ruta
module.exports = router;
