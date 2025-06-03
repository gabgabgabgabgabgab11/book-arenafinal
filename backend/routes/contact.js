const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Insert contact via stored procedure
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, countryCode, inquiryType, message } = req.body;
    await pool.execute(
      'CALL insert_contact(?, ?, ?, ?, ?, ?)',
      [name, email, phone, countryCode, inquiryType, message]
    );
    res.json({ message: "Thank you for contacting us! We'll get back to you soon." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send contact message." });
  }
});

// Get all contacts via stored procedure
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL get_all_contacts()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contacts." });
  }
});

module.exports = router;