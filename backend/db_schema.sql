-- DATABASE CREATION
CREATE DATABASE IF NOT EXISTS arena_booking;
USE arena_booking;

-- ===================
-- 1. USERS & LOOKUP TABLES
-- ===================

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  method VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS seating_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(64) NOT NULL UNIQUE
);

INSERT IGNORE INTO payment_methods (method) VALUES ('cash'), ('credit_card'), ('paypal'), ('gcash');
INSERT IGNORE INTO seating_types (type) VALUES ('theater'), ('classroom'), ('banquet'), ('u-shape'), ('custom');

-- ===================
-- 2. BOOKINGS TABLE (normalized)
-- ===================
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255),
    event_date VARCHAR(255),
    ticket_amount INT,
    special_requirements TEXT,
    id_image VARCHAR(255), -- stores file path, not the image itself
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    payment_method_id INT,
    seating_type_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    FOREIGN KEY (seating_type_id) REFERENCES seating_types(id)
);

-- ===================
-- 3. CONTACTS TABLE
-- ===================
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    country_code VARCHAR(10),
    inquiry_type VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================
-- 4. VENUE RENTAL APPLICATIONS (standalone, not normalized for users)
-- ===================
CREATE TABLE IF NOT EXISTS venue_rental_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  org_type VARCHAR(100) NOT NULL,
  business_address VARCHAR(255) NOT NULL,
  tax_id VARCHAR(100) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  position_title VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_background TEXT NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_description TEXT NOT NULL,
  preferred_date_1 DATE DEFAULT NULL,
  preferred_date_2 DATE DEFAULT NULL,
  preferred_date_3 DATE DEFAULT NULL,
  event_duration VARCHAR(20) NOT NULL,
  setup_days VARCHAR(20) NOT NULL,
  expected_attendance VARCHAR(20) NOT NULL,
  target_audience VARCHAR(255) NOT NULL,
  stage_req TEXT NOT NULL,
  sound_req TEXT NOT NULL,
  lighting_req TEXT NOT NULL,
  seating_arrangement VARCHAR(50) NOT NULL,
  custom_seating TEXT NOT NULL,
  facilities_needed TEXT NOT NULL,
  catering_req TEXT NOT NULL,
  security_req TEXT NOT NULL,
  additional_info TEXT,
  agree_terms TINYINT(1) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================
-- 5. STORED PROCEDURES
-- ===================

-- BOOKING INSERTION
DELIMITER $$
CREATE PROCEDURE insert_booking(
  IN eventName VARCHAR(255),
  IN eventDate VARCHAR(255),
  IN ticketAmount INT,
  IN specialRequirements TEXT,
  IN idImagePath VARCHAR(255),
  IN userId INT,
  IN paymentMethodId INT,
  IN seatingTypeId INT
)
BEGIN
  INSERT INTO bookings (
    event_name, event_date, ticket_amount, special_requirements, id_image, user_id, payment_method_id, seating_type_id
  )
  VALUES (
    eventName, eventDate, ticketAmount, specialRequirements, idImagePath, userId, paymentMethodId, seatingTypeId
  );
END $$
DELIMITER ;

-- GET ALL BOOKINGS
DELIMITER $$
CREATE PROCEDURE get_all_bookings()
BEGIN
  SELECT b.*, 
         u.full_name, u.email, u.phone,
         pm.method AS payment_method,
         st.type AS seating_type
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN payment_methods pm ON b.payment_method_id = pm.id
    LEFT JOIN seating_types st ON b.seating_type_id = st.id;
END $$
DELIMITER ;
DELIMITER $$

CREATE PROCEDURE get_full_bookings()
BEGIN
  SELECT 
    bookings.id,
    bookings.event_name,
    bookings.event_date,
    bookings.ticket_amount,
    bookings.special_requirements,
    bookings.id_image,
    bookings.created_at,
    users.full_name,
    users.email,
    users.phone,
    payment_methods.method AS payment_method,
    seating_types.type AS seating_type
  FROM bookings
  LEFT JOIN users ON bookings.user_id = users.id
  LEFT JOIN payment_methods ON bookings.payment_method_id = payment_methods.id
  LEFT JOIN seating_types ON bookings.seating_type_id = seating_types.id
  ORDER BY bookings.id DESC;
END$$

DELIMITER ;

-- CONTACT INSERTION
DELIMITER $$
CREATE PROCEDURE insert_contact(
  IN name VARCHAR(255),
  IN email VARCHAR(255),
  IN phone VARCHAR(255),
  IN countryCode VARCHAR(10),
  IN inquiryType VARCHAR(255),
  IN message TEXT
)
BEGIN
  INSERT INTO contacts (
    name, email, phone, country_code, inquiry_type, message
  )
  VALUES (
    name, email, phone, countryCode, inquiryType, message
  );
END $$
DELIMITER ;

-- GET ALL CONTACTS
DELIMITER $$
CREATE PROCEDURE get_all_contacts()
BEGIN
  SELECT * FROM contacts;
END $$
DELIMITER ;

-- VENUE RENTAL APPLICATION INSERTION
DELIMITER $$
CREATE PROCEDURE insert_venue_rental_application(
  IN companyName VARCHAR(255), IN orgType VARCHAR(100), IN businessAddress VARCHAR(255), IN taxId VARCHAR(100),
  IN contactPerson VARCHAR(255), IN positionTitle VARCHAR(100), IN email VARCHAR(255), IN phone VARCHAR(50), IN companyBackground TEXT,
  IN eventTitle VARCHAR(255), IN eventType VARCHAR(100), IN eventDescription TEXT,
  IN preferredDate1 DATE, IN preferredDate2 DATE, IN preferredDate3 DATE,
  IN eventDuration VARCHAR(20), IN setupDays VARCHAR(20), IN expectedAttendance VARCHAR(20), IN targetAudience VARCHAR(255),
  IN stageReq TEXT, IN soundReq TEXT, IN lightingReq TEXT, IN seatingArrangement VARCHAR(50), IN customSeating TEXT,
  IN facilitiesNeeded TEXT, IN cateringReq TEXT, IN securityReq TEXT, IN additionalInfo TEXT,
  IN agreeTerms TINYINT
)
BEGIN
  INSERT INTO venue_rental_applications (
    company_name, org_type, business_address, tax_id,
    contact_person, position_title, email, phone, company_background,
    event_title, event_type, event_description,
    preferred_date_1, preferred_date_2, preferred_date_3,
    event_duration, setup_days, expected_attendance, target_audience,
    stage_req, sound_req, lighting_req, seating_arrangement, custom_seating,
    facilities_needed, catering_req, security_req, additional_info, agree_terms
  ) VALUES (
    companyName, orgType, businessAddress, taxId,
    contactPerson, positionTitle, email, phone, companyBackground,
    eventTitle, eventType, eventDescription,
    preferredDate1, preferredDate2, preferredDate3,
    eventDuration, setupDays, expectedAttendance, targetAudience,
    stageReq, soundReq, lightingReq, seatingArrangement, customSeating,
    facilitiesNeeded, cateringReq, securityReq, additionalInfo, agreeTerms
  );
END $$
DELIMITER ;

-- GET ALL VENUE RENTAL APPLICATIONS
DELIMITER $$
CREATE PROCEDURE get_all_venue_rental_applications()
BEGIN
    SELECT * FROM venue_rental_applications;
END $$
DELIMITER ;

-- Get or create user by email
DELIMITER $$
CREATE PROCEDURE get_or_create_user(
  IN full_name VARCHAR(255),
  IN email VARCHAR(255),
  IN phone VARCHAR(64)
)
BEGIN
  DECLARE uid INT;
  SELECT id INTO uid FROM users WHERE users.email = email LIMIT 1;
  IF uid IS NULL THEN
    INSERT INTO users (full_name, email, phone) VALUES (full_name, email, phone);
    SET uid = LAST_INSERT_ID();
  END IF;
  SELECT uid AS id;
END $$
DELIMITER ;

-- Get or create payment method
DELIMITER $$
CREATE PROCEDURE get_or_create_payment_method(
  IN method_val VARCHAR(64)
)
BEGIN
  DECLARE pmid INT;
  SELECT id INTO pmid FROM payment_methods WHERE method = method_val LIMIT 1;
  IF pmid IS NULL THEN
    INSERT INTO payment_methods (method) VALUES (method_val);
    SET pmid = LAST_INSERT_ID();
  END IF;
  SELECT pmid AS id;
END $$
DELIMITER ;

-- Get or create seating type
DELIMITER $$
CREATE PROCEDURE get_or_create_seating_type(
  IN type_val VARCHAR(64)
)
BEGIN
  DECLARE stid INT;
  SELECT id INTO stid FROM seating_types WHERE type = type_val LIMIT 1;
  IF stid IS NULL THEN
    INSERT INTO seating_types (type) VALUES (type_val);
    SET stid = LAST_INSERT_ID();
  END IF;
  SELECT stid AS id;
END $$
DELIMITER ;


-- For updating a booking
DELIMITER //
CREATE PROCEDURE update_booking(
  IN p_booking_id INT,
  IN p_event_name VARCHAR(255),
  IN p_ticket_amount INT,
  IN p_special_requirements TEXT,
  IN p_user_full_name VARCHAR(255),
  IN p_user_email VARCHAR(255),
  IN p_user_phone VARCHAR(64),
  IN p_payment_method VARCHAR(64),
  IN p_seating_type VARCHAR(64)
)
BEGIN
  -- Update user info
  UPDATE users
    INNER JOIN bookings ON bookings.user_id = users.id
    SET users.full_name = p_user_full_name,
        users.email = p_user_email,
        users.phone = p_user_phone
    WHERE bookings.id = p_booking_id;

  -- Insert/find payment method
  INSERT IGNORE INTO payment_methods (method) VALUES (p_payment_method);
  SET @payment_method_id = (SELECT id FROM payment_methods WHERE method = p_payment_method LIMIT 1);

  -- Insert/find seating type
  INSERT IGNORE INTO seating_types (type) VALUES (p_seating_type);
  SET @seating_type_id = (SELECT id FROM seating_types WHERE type = p_seating_type LIMIT 1);

  -- Update booking
  UPDATE bookings
    SET event_name = p_event_name,
        ticket_amount = p_ticket_amount,
        special_requirements = p_special_requirements,
        payment_method_id = @payment_method_id,
        seating_type_id = @seating_type_id
    WHERE id = p_booking_id;
END //
DELIMITER ;

-- For updating a contact
DELIMITER //
CREATE PROCEDURE update_contact(
  IN p_id INT,
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(255),
  IN p_inquiryType VARCHAR(255),
  IN p_message TEXT
)
BEGIN
  UPDATE contacts
  SET name = p_name,
      email = p_email,
      phone = p_phone,
      inquiry_type = p_inquiryType,
      message = p_message
  WHERE id = p_id;
END //
DELIMITER ;

-- For updating a venue rental
DELIMITER //
CREATE PROCEDURE update_venue_rental(
  IN p_id INT,
  IN p_company_name VARCHAR(255),
  IN p_contact_person VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_phone VARCHAR(255),
  IN p_event_title VARCHAR(255),
  IN p_event_type VARCHAR(255),
  IN p_preferred_date_1 DATE,
  IN p_preferred_date_2 DATE,
  IN p_preferred_date_3 DATE,
  IN p_expected_attendance INT,
  IN p_stage_req VARCHAR(255),
  IN p_sound_req VARCHAR(255),
  IN p_lighting_req VARCHAR(255),
  IN p_catering_req VARCHAR(255),
  IN p_security_req VARCHAR(255)
)
BEGIN
  UPDATE venue_rental_applications
  SET company_name = p_company_name,
      contact_person = p_contact_person,
      email = p_email,
      phone = p_phone,
      event_title = p_event_title,
      event_type = p_event_type,
      preferred_date_1 = p_preferred_date_1,
      preferred_date_2 = p_preferred_date_2,
      preferred_date_3 = p_preferred_date_3,
      expected_attendance = p_expected_attendance,
      stage_req = p_stage_req,
      sound_req = p_sound_req,
      lighting_req = p_lighting_req,
      catering_req = p_catering_req,
      security_req = p_security_req
  WHERE id = p_id;
END //
DELIMITER ;