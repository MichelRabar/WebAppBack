import express from 'express';
import { connectToDatabase } from './db'; // Uvezivanje funkcije za uspostavljanje veze s bazom podataka

const app = express(); // Instanciranje aplikacije
const port = 3000; // Port na kojem će web server slušati

// Ruta za početnu stranicu
app.get('/', (req, res) => {
    res.send('Hello World, ovaj puta preko browsera!');
});

// Poziv funkcije za uspostavljanje veze s bazom podataka
connectToDatabase().then(() => {
    // Nakon uspješne veze s bazom podataka, pokrenite server
    app.listen(port, () => {
        console.log(`Slušam na portu ${port}!`);
    });
}).catch((error) => {
    console.error('Greška pri uspostavljanju veze s bazom podataka:', error);
});
