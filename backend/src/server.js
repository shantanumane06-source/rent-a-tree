const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trees', require('./routes/trees'));
app.use('/api/adoptions', require('./routes/adoptions'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.json({ message: 'Rent-a-Tree API Running 🌳' }));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
