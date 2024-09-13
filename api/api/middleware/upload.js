// api/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Postavke za čuvanje fajlova
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Putanja gde će slike biti sačuvane
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Dodajte jedinstveni identifikator na ime fajla
    }
});

const fileFilter = (req, file, cb) => {
    // Samo slike su dozvoljene
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload an image.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;

