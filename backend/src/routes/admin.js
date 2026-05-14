const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Dashboard stats
router.get('/stats', auth(['admin']), async (req, res) => {
  try {
    const [[{ customers }]] = await db.execute('SELECT COUNT(*) as customers FROM customers');
    const [[{ farmers }]] = await db.execute('SELECT COUNT(*) as farmers FROM farmers WHERE status="approved"');
    const [[{ trees }]] = await db.execute('SELECT COUNT(*) as trees FROM trees WHERE status="approved"');
    const [[{ adoptions }]] = await db.execute('SELECT COUNT(*) as adoptions FROM adoptions');
    const [[{ revenue }]] = await db.execute('SELECT COALESCE(SUM(total_payment),0) as revenue FROM adoptions WHERE payment_status="paid"');
    const [[{ pending_farmers }]] = await db.execute('SELECT COUNT(*) as pending_farmers FROM farmers WHERE status="pending"');
    const [[{ pending_trees }]] = await db.execute('SELECT COUNT(*) as pending_trees FROM trees WHERE status="pending"');
    res.json({ customers, farmers, trees, adoptions, revenue, pending_farmers, pending_trees });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get all customers
router.get('/customers', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id,name,email,phone,city,status,created_at FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get all farmers
router.get('/farmers', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id,name,email,phone,city,farm_location,status,created_at FROM farmers ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update farmer status
router.put('/farmers/:id', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE farmers SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Farmer ${status}` });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update customer status
router.put('/customers/:id', auth(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE customers SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Customer ${status}` });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get disputes
router.get('/disputes', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM disputes ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Resolve dispute
router.put('/disputes/:id', auth(['admin']), async (req, res) => {
  try {
    const { status, resolution } = req.body;
    await db.execute('UPDATE disputes SET status=?, resolution=? WHERE id=?', [status, resolution, req.params.id]);
    res.json({ message: 'Dispute updated' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
