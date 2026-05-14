const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get approved trees (public / customer)
router.get('/', async (req, res) => {
  try {
    const { city, type } = req.query;
    let query = `SELECT t.*, f.name as farmer_name, f.city as farmer_city 
                 FROM trees t JOIN farmers f ON t.farmer_id = f.id 
                 WHERE t.status = 'approved'`;
    const params = [];
    if (city) { query += ' AND t.city LIKE ?'; params.push(`%${city}%`); }
    if (type) { query += ' AND t.tree_type LIKE ?'; params.push(`%${type}%`); }
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get single tree
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT t.*, f.name as farmer_name, f.city as farmer_city, f.farm_location FROM trees t JOIN farmers f ON t.farmer_id = f.id WHERE t.id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Tree not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Farmer: Add tree
router.post('/', auth(['farmer']), upload.single('tree_image'), async (req, res) => {
  try {
    const { tree_type, age_years, city, farm_location, maintenance_cost, delivery_cost, description } = req.body;
    const tree_code = 'TREE-' + Date.now();
    const img = req.file ? req.file.filename : null;
    await db.execute(
      'INSERT INTO trees (farmer_id,tree_code,tree_type,age_years,city,farm_location,tree_image,maintenance_cost,delivery_cost,description) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [req.user.id, tree_code, tree_type, age_years, city, farm_location, img, maintenance_cost, delivery_cost, description]
    );
    res.json({ message: 'Tree submitted for approval', tree_code });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Farmer: Update tree status
router.put('/:id/growth', auth(['farmer']), async (req, res) => {
  try {
    const { growth_status } = req.body;
    await db.execute('UPDATE trees SET growth_status = ? WHERE id = ? AND farmer_id = ?',
      [growth_status, req.params.id, req.user.id]);
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Farmer: Get my trees
router.get('/farmer/my', auth(['farmer']), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM trees WHERE farmer_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: Get all trees
router.get('/admin/all', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT t.*, f.name as farmer_name FROM trees t JOIN farmers f ON t.farmer_id = f.id ORDER BY t.created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: Approve/Reject tree
router.put('/:id/status', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE trees SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Tree ${status}` });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
