const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174']
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

// Connect to MongoDB with retry logic if it's not running yet
const connectWithRetry = () => {
    console.log('Connecting to MongoDB...');
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected Successfully!'))
        .catch(err => {
            console.error('MongoDB Connection Error:', err.message || err);
            console.log('MongoDB might not be running yet. Retrying to connect in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
