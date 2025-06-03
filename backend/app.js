const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded ID images if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/venue-rental', require('./routes/venueRental')); // <-- Add this line

app.get('/test', (req, res) => {
  res.send('Test route works!');
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});