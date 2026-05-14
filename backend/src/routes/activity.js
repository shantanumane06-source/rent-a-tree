const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Farmer: Log maintenance
router.post('/maintenance', auth(['farmer']), upload.single('log_image'), async (req, res) => {
  try {
    const { tree_id, activity_type, description, log_date } = req.body;
    const img = req.file ? req.file.filename : null;
    await db.execute(
      'INSERT INTO maintenance_logs (tree_id,farmer_id,activity_type,description,log_image,log_date) VALUES (?,?,?,?,?,?)',
      [tree_id, req.user.id, activity_type, description, img, log_date]
    );
    res.json({ message: 'Maintenance logged' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get maintenance logs for a tree
router.get('/maintenance/:tree_id', auth(['farmer','customer','admin']), async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM maintenance_logs WHERE tree_id = ? ORDER BY log_date DESC', [req.params.tree_id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Farmer: Record harvest
router.post('/harvest', auth(['farmer']), upload.single('fruit_image'), async (req, res) => {
  try {
    const { tree_id, adoption_id, yield_kg, market_price_per_kg, harvest_date, notes } = req.body;
    const yKg = parseFloat(yield_kg), price = parseFloat(market_price_per_kg);
    const total_revenue = yKg * price;
    const platform_commission = total_revenue * 0.1;
    const customer_profit = total_revenue - platform_commission;
    const img = req.file ? req.file.filename : null;
    await db.execute(
      'INSERT INTO harvests (tree_id,adoption_id,fruit_image,yield_kg,market_price_per_kg,total_revenue,platform_commission,customer_profit,harvest_date,notes) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [tree_id, adoption_id, img, yKg, price, total_revenue, platform_commission, customer_profit, harvest_date, notes]
    );
    await db.execute('UPDATE adoptions SET profit_share = ? WHERE id = ?', [customer_profit, adoption_id]);
    await db.execute('UPDATE trees SET status = "harvested", growth_status = "Harvested" WHERE id = ?', [tree_id]);
    res.json({ message: 'Harvest recorded', customer_profit });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get harvests for farmer
router.get('/harvest/farmer', auth(['farmer']), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT h.*, t.tree_type, t.tree_code FROM harvests h 
       JOIN trees t ON h.tree_id = t.id WHERE t.farmer_id = ? ORDER BY h.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
