CREATE DATABASE IF NOT EXISTS arena_booking;
USE arena_booking;

CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255),
    event_date VARCHAR(255),
    seating_type VARCHAR(100),
    ticket_amount INT,
    special_requirements TEXT,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(50),
    payment_method VARCHAR(50),
    id_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE venue_rental_applications (
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

-- Insert booking stored procedure
DELIMITER //
CREATE PROCEDURE insert_booking(
  IN eventName VARCHAR(255),
  IN eventDate DATE,
  IN seatingType VARCHAR(255),
  IN ticketAmount INT,
  IN specialRequirements TEXT,
  IN fullName VARCHAR(255),
  IN email VARCHAR(255),
  IN phoneNo VARCHAR(255),
  IN paymentMethod VARCHAR(255),
  IN idImagePath VARCHAR(255)
)
BEGIN
  INSERT INTO bookings (
    event_name, event_date, seating_type, ticket_amount, 
    special_requirements, full_name, email, phone_no, payment_method, id_image
  )
  VALUES (
    eventName, eventDate, seatingType, ticketAmount, specialRequirements,
    fullName, email, phoneNo, paymentMethod, idImagePath
  );
END //
DELIMITER ;

-- Fetch all bookings stored procedure
DELIMITER //
CREATE PROCEDURE get_all_bookings()
BEGIN
  SELECT * FROM bookings;
END //
DELIMITER ;


DELIMITER //
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
END //
DELIMITER ;

-- Fetch all contacts stored procedure
DELIMITER //
CREATE PROCEDURE get_all_contacts()
BEGIN
  SELECT * FROM contacts;
END //
DELIMITER ;



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


CREATE PROCEDURE get_all_venue_rental_applications()
BEGIN
    SELECT * FROM venue_rental_applications;
END $$

DELIMITER ;