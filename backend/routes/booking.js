const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

// For file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage: storage });

// Insert booking via stored procedure
router.post('/', upload.single('idImage'), async (req, res) => {
  try {
    const {
      eventName, eventDate, seatingType, ticketAmount, specialRequirements,
      fullName, email, phoneNo, paymentMethod
    } = req.body;
    const idImagePath = req.file ? req.file.filename : null;

    await pool.execute(
      'CALL insert_booking(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [eventName, eventDate, seatingType, ticketAmount, specialRequirements, fullName, email, phoneNo, paymentMethod, idImagePath]
    );

    res.json({ message: "Booking received! We'll contact you soon." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed." });
  }
});

// Get all bookings via stored procedure
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL get_all_bookings()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

module.exports = router;