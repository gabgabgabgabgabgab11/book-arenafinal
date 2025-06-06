require('dotenv').config(); // Ensure dotenv is loaded at the very top

const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// === CONFIG ===
// Dynamically select config: use Railway env vars if present, else fallback to local
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arena_booking',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
};

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());

// --- Multer setup: save images with correct extension ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// === API ROUTES ===

// CONTACTS API (unchanged)
app.post('/api/contacts', async (req, res) => {
  const { name, email, phone, countryCode, inquiryType, message } = req.body;
  if (!name || !email || !phone || !countryCode || !inquiryType || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const db = await mysql.createConnection(dbConfig);
    await db.query('CALL insert_contact(?,?,?,?,?,?)', [
      name,
      email,
      phone,
      countryCode,
      inquiryType,
      message,
    ]);
    await db.end();
    res.json({ message: 'Thank you for contacting us!' });
  } catch (err) {
    console.error('Contact insert error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY id DESC');
    await db.end();
    res.json(rows);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ message: 'Failed to get contacts.' });
  }
});

// BOOKINGS API
app.post('/api/bookings', upload.single('idImage'), async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      seatingType,
      ticketAmount,
      specialRequirements,
      fullName,
      email,
      phone,
      paymentMethod,
    } = req.body;
    if (
      !eventName ||
      !eventDate ||
      !seatingType ||
      !ticketAmount ||
      !fullName ||
      !email ||
      !phone ||
      !paymentMethod ||
      !req.file
    ) {
      return res.status(400).json({ message: 'All fields including ID image are required.' });
    }
    const idImagePath = req.file.filename; // store just the filename, not full path

    const db = await mysql.createConnection(dbConfig);

    // Get or create user
    const [userRows] = await db.query('CALL get_or_create_user(?,?,?)', [
      fullName,
      email,
      phone,
    ]);
    const userId = userRows[0][0].id;

    // Get or create payment method
    const [pmRows] = await db.query('CALL get_or_create_payment_method(?)', [
      paymentMethod,
    ]);
    const paymentMethodId = pmRows[0][0].id;

    // Get or create seating type
    const [stRows] = await db.query('CALL get_or_create_seating_type(?)', [
      seatingType,
    ]);
    const seatingTypeId = stRows[0][0].id;

    // Insert booking
    await db.query(
      'CALL insert_booking(?,?,?,?,?,?,?,?)',
      [
        eventName,
        eventDate,
        parseInt(ticketAmount, 10),
        specialRequirements || '',
        idImagePath,
        userId,
        paymentMethodId,
        seatingTypeId,
      ]
    );
    await db.end();

    res.json({ message: 'Booking successful!' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Booking failed.' });
  }
});

// GET all bookings (using stored procedure with joins)
app.get('/api/bookings', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [resultSets] = await db.query('CALL get_full_bookings()');
    await db.end();
    const rows = resultSets[0];

    // Make id_image browser-friendly
    const bookings = rows.map(b => ({
      ...b,
      id_image: b.id_image ? '/uploads/' + b.id_image.replace(/^.*[\\\/]/, '') : ''
    }));

    res.json(bookings);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ message: 'Failed to get bookings.' });
  }
});

// Delete booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;
  try {
    const db = await mysql.createConnection(dbConfig);
    await db.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
    await db.end();
    res.json({ message: 'Booking deleted.' });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ message: 'Failed to delete booking.' });
  }
});

// VENUE RENTAL API (unchanged)
app.post('/api/venue-rental', async (req, res) => {
  const data = req.body;
  const required = [
    'companyName', 'orgType', 'businessAddress', 'taxId', 'contactPerson', 'positionTitle', 'email',
    'phone', 'companyBackground', 'eventTitle', 'eventType', 'eventDescription', 'eventDuration',
    'setupDays', 'expectedAttendance', 'targetAudience', 'stageReq', 'soundReq', 'lightingReq',
    'seatingArrangement', 'customSeating', 'facilitiesNeeded', 'cateringReq', 'securityReq', 'agreeTerms'
  ];
  for (const key of required) {
    if (
      data[key] === undefined ||
      data[key] === null ||
      (typeof data[key] === 'string' && data[key].trim() === '')
    ) {
      return res.status(400).json({ message: `Missing required field: ${key}` });
    }
  }
  try {
    const db = await mysql.createConnection(dbConfig);
    await db.query(
      'CALL insert_venue_rental_application(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        data.companyName, data.orgType, data.businessAddress, data.taxId,
        data.contactPerson, data.positionTitle, data.email, data.phone, data.companyBackground,
        data.eventTitle, data.eventType, data.eventDescription,
        data.preferredDate1 || null, data.preferredDate2 || null, data.preferredDate3 || null,
        data.eventDuration, data.setupDays, data.expectedAttendance, data.targetAudience,
        data.stageReq, data.soundReq, data.lightingReq, data.seatingArrangement, data.customSeating,
        data.facilitiesNeeded, data.cateringReq, data.securityReq, data.additionalInfo || null,
        data.agreeTerms ? 1 : 0
      ]
    );
    await db.end();
    res.json({ message: 'Venue rental application submitted!' });
  } catch (err) {
    console.error('Venue rental error:', err);
    res.status(500).json({ message: 'Failed to submit venue rental application.' });
  }
});

// GET all venue rental applications
app.get('/api/venue-rental', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query('SELECT * FROM venue_rental_applications ORDER BY id DESC');
    await db.end();
    res.json(rows);
  } catch (err) {
    console.error('Get venue rentals error:', err);
    res.status(500).json({ message: 'Failed to get venue rental applications.' });
  }
});

// === STATIC FILES (after API routes) ===
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// === SPA fallback (must be last!) ===
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend (contacts, bookings, venue rental) running on port ${PORT}`);
});