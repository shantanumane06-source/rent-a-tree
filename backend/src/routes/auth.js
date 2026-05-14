const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const upload = require('../middleware/upload');

const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// Customer Register
router.post('/customer/register', upload.single('profile_image'), async (req, res) => {
  try {
    const { name, email, phone, city, address, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const img = req.file ? req.file.filename : null;
    const [result] = await db.execute(
      'INSERT INTO customers (name,email,phone,city,address,password,profile_image) VALUES (?,?,?,?,?,?,?)',
      [name, email, phone, city, address, hash, img]
    );
    const token = sign({ id: result.insertId, role: 'customer', name });
    res.json({ token, user: { id: result.insertId, name, email, role: 'customer' } });
  } catch (e) {
    res.status(400).json({ message: e.code === 'ER_DUP_ENTRY' ? 'Email already exists' : e.message });
  }
});

// Farmer Register
router.post('/farmer/register', upload.single('profile_image'), async (req, res) => {
  try {
    const { name, email, phone, city, farm_location, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const img = req.file ? req.file.filename : null;
    const [result] = await db.execute(
      'INSERT INTO farmers (name,email,phone,city,farm_location,password,profile_image) VALUES (?,?,?,?,?,?,?)',
      [name, email, phone, city, farm_location, hash, img]
    );
    res.json({ message: 'Registration submitted. Await admin approval.' });
  } catch (e) {
    res.status(400).json({ message: e.code === 'ER_DUP_ENTRY' ? 'Email already exists' : e.message });
  }
});

// Login (all roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let table = role === 'admin' ? 'admins' : role === 'farmer' ? 'farmers' : 'customers';
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const user = rows[0];
    if (user.status === 'suspended') return res.status(403).json({ message: 'Account suspended' });
    if (role === 'farmer' && user.status === 'pending') return res.status(403).json({ message: 'Account pending approval' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = sign({ id: user.id, role, name: user.name, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role, profile_image: user.profile_image } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
