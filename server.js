require('dotenv').config(); // Load environment variables from .env file
require('./config/db'); // Connect to the database

const express = require('express');
const bodyParser = require('body-parser'); // Correctly import bodyParser middleware
const app = express();
const port = 3000;

// Use bodyParser middleware to parse JSON request bodies
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
