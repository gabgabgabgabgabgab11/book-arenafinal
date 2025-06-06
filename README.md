# Philippine Arena Booking System

This project is a full-featured web application for managing event bookings and venue rental applications for the Philippine Arena.  
It includes a **public-facing booking site** (for users to book tickets and apply for venue rental) and a **modern admin panel** for managing and reviewing all submissions.

---

## Features

### 🏟️ Public Booking Site (`index.html`)
- **Book Event Tickets:**  
  Users can browse events and book tickets by providing their details, uploading a valid ID photo, selecting seating type, and payment method.
- **Venue Rental Application:**  
  Organizations can submit detailed applications to rent the arena for private events, including company info, event details, facility needs, and more.
- **Contact Form:**  
  Simple form for user inquiries, routed directly to the admin panel.
- **Mobile-Friendly, Modern UI:**  
  Responsive design with consistent Philippine Arena branding.

### 🔑 Admin Panel (`admin.html`)
- **Secure Login Overlay:**  
  Easy admin authentication (in-browser, customizable credentials).
- **Bookings Management:**  
  View all ticket bookings in a sortable, filterable table.  
  View ID images in a modal overlay.
- **Venue Rental Management:**  
  Review all venue rental applications with full details.
- **Contact Inquiries:**  
  See all user inquiries submitted from the public site.
- **Consistent UI:**  
  Modern, clean admin dashboard matching the main site's branding.

---

## Database Structure (Normalized)

The backend uses a **fully normalized MySQL schema** for flexibility and reliability:

```
users
-----
id (PK)
full_name
email
phone

payment_methods
--------------
id (PK)
method

seating_types
-------------
id (PK)
type

bookings
--------
id (PK)
event_name
event_date
ticket_amount
special_requirements
id_image
created_at
user_id (FK → users.id)
payment_method_id (FK → payment_methods.id)
seating_type_id (FK → seating_types.id)

venue_rental_applications
------------------------
id (PK)
company_name
org_type
business_address
tax_id
contact_person
position_title
email
phone
company_background
event_title
event_type
event_description
preferred_date1
preferred_date2
preferred_date3
event_duration
setup_days
expected_attendance
target_audience
stage_req
sound_req
lighting_req
seating_arrangement
custom_seating
facilities_needed
catering_req
security_req
additional_info
agree_terms
created_at

contacts
--------
id (PK)
name
email
phone
country_code
inquiry_type
message
created_at
```

All booking, venue rental, and contact insertions use **stored procedures** for safety and performance.

---

## Backend/Server (`server.js`)

- **Express API** for all public and admin endpoints.
- **Multer** for file uploads (ID images, stored with proper file extensions).
- **MySQL2/promise** for async database access.
- **CORS** enabled for local development.

**Key Endpoints:**
- `POST /api/bookings` — Submit a new event ticket booking (with ID image).
- `GET /api/bookings` — Admin: List all bookings (with joined user, payment, and seating info).
- `POST /api/venue-rental` — Submit a venue rental application.
- `GET /api/venue-rental` — Admin: List all venue rental applications.
- `POST /api/contacts` — Public: Contact form submission.
- `GET /api/contacts` — Admin: List all contact inquiries.

Image uploads are served at `/uploads/filename.jpg`.

---

## File Structure

```
/public
  ├─ index.html         # Main booking site (public)
  ├─ admin.html         # Admin dashboard
  ├─ admin.js           # Admin logic (login, data, modal, etc.)
  ├─ admin.css          # Shared/main branding styles
  └─ other assets...

/uploads                # Uploaded ID images (auto-created, .gitignore'd)

server.js               # Node.js backend
package.json
README.md
```

---

## Example Stored Procedure for Bookings

```sql
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
END
```

---

## Getting Started

1. **Clone and install dependencies:**
    ```sh
    git clone https://github.com/gabgabgabgabgabgab11/book-arenafinal.git
    cd book-arenafinal
    npm install
    ```

2. **Set up the database:**
    - Create the `arena_booking` MySQL database.
    - Run the table and stored procedure scripts (db_schema.sql).
    - Ensure the `uploads` folder exists and is writable.

3. **Run the backend:**
    ```s
    Open Terminal
    cd backend
    
    node server.js
    or
    npm start
    ```
    The API and static files will be served at [http://localhost:5000](http://localhost:5000).

4. **Access the application:**
    - **Public Booking Site:** [http://localhost:5000/index.html](http://localhost:5000/index.html)
    - **Admin Dashboard:** [http://localhost:5000/admin.html](http://localhost:5000/admin.html)  
      (Login credentials are set in `admin.js`)



## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Acknowledgements

- Built with Node.js, Express, MySQL, and vanilla JS/CSS/HTML.
- Inspired by the needs of event and venue management.
