require('dotenv').config();
console.log(process.env);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.log("Error connecting to DB:", err);
    });
