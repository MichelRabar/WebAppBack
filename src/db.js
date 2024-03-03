const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://michelrabar:<MONGO>@cluster0.seukvd5.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('Cluster0');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

function getDatabase() {
    return db;
}

module.exports = { connectToDatabase, getDatabase };
