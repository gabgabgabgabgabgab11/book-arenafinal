const express = require('express');
const router = express.Router();
const pool = require('../config/db');
// Helper function for date fields
function toNullIfEmpty(val) { return val === "" ? null : val; }

router.post('/', async (req, res) => {
  try {
    const d = req.body;
    const params = [
      d.companyName,
      d.orgType,
      d.businessAddress,
      d.taxId,
      d.contactPerson,
      d.positionTitle,
      d.email,
      d.phone,
      d.companyBackground,
      d.eventTitle,
      d.eventType,
      d.eventDescription,
      toNullIfEmpty(d.preferredDate1),
      toNullIfEmpty(d.preferredDate2),
      toNullIfEmpty(d.preferredDate3),
      d.eventDuration,
      d.setupDays,
      d.expectedAttendance,
      d.targetAudience,
      d.stageReq,
      d.soundReq,
      d.lightingReq,
      d.seatingArrangement,
      d.customSeating,
      d.facilitiesNeeded,
      d.cateringReq,
      d.securityReq,
      d.additionalInfo,
      d.agreeTerms ? 1 : 0 // TINYINT (1 or 0)
    ];

    // Debug: print params and length
    console.log("Params length:", params.length);
    console.log("Params:", params);

    // Must have 29 question marks!
    await pool.execute(
      'CALL insert_venue_rental_application(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      params
    );
    res.json({ message: 'Application submitted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Submission failed.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL get_all_venue_rental_applications()');
    res.json(rows[0]); // rows[0] contains the actual result set
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications." });
  }
});

module.exports = router;