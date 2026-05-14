const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Customer: Adopt a tree
router.post('/', auth(['customer']), async (req, res) => {
  try {
    const { tree_id, delivery_type } = req.body;
    const [trees] = await db.execute('SELECT * FROM trees WHERE id = ? AND status = "approved"', [tree_id]);
    if (!trees.length) return res.status(404).json({ message: 'Tree not available' });
    const tree = trees[0];
    const adoption_fee = parseFloat(tree.maintenance_cost);
    const delivery_fee = delivery_type === 'home_delivery' ? parseFloat(tree.delivery_cost) : 0;
    const total_payment = adoption_fee + delivery_fee;
    await db.execute(
      'INSERT INTO adoptions (customer_id,tree_id,delivery_type,adoption_fee,delivery_fee,total_payment) VALUES (?,?,?,?,?,?)',
      [req.user.id, tree_id, delivery_type, adoption_fee, delivery_fee, total_payment]
    );
    await db.execute('UPDATE trees SET status = "adopted" WHERE id = ?', [tree_id]);
    res.json({ message: 'Tree adopted successfully!', total_payment });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Customer: My adoptions
router.get('/my', auth(['customer']), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.*, t.tree_type, t.tree_code, t.city, t.tree_image, t.growth_status, t.description,
              f.name as farmer_name, f.phone as farmer_phone
       FROM adoptions a 
       JOIN trees t ON a.tree_id = t.id 
       JOIN farmers f ON t.farmer_id = f.id
       WHERE a.customer_id = ? ORDER BY a.adopted_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: All adoptions
router.get('/admin/all', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.*, t.tree_type, t.tree_code, c.name as customer_name, f.name as farmer_name
       FROM adoptions a 
       JOIN trees t ON a.tree_id = t.id 
       JOIN customers c ON a.customer_id = c.id
       JOIN farmers f ON t.farmer_id = f.id
       ORDER BY a.adopted_at DESC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
