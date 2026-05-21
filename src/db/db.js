const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

async function connectDB() {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri) {
            console.log('No MONGODB_URI found — starting local in-memory MongoDB...');
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log('Local MongoDB started at:', uri);
        }

        await mongoose.connect(uri);
        console.log('Connected to database');
    } catch (error) {
        console.log('Database connection error:', error);
    }
}

module.exports = connectDB;
