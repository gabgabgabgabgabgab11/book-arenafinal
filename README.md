# Philippine Arena Booking System

A web application for booking arena events, submitting venue rental applications, and handling customer inquiries.

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

### 3. Set up Environment Variables

- The repository expects a `.env` file in the `backend/` directory.
- Example `.env` variables you might need (do **not** commit secrets to GitHub):

  ```
  DB_HOST=localhost
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_NAME=arena_booking
  ```

### 4. Set up the Database

- Import `db_schema.sql` into your MySQL server to create the necessary tables.

### 5. Start the Backend Server

```bash
npm start
```
or
```bash
node app.js
```

### 6. Open the Frontend

- Open `frontend/InfoM/index.html` in your browser to use the application.

---

## Usage

- **Book an Event:** Go to the booking page and fill out the form with event details.
- **Venue Rental:** On the venue rental page, complete the application form.
- **Contact:** Use the contact form for questions or feedback.

---

## Folder Overview

- `backend/` – Node.js/Express server, routes, database logic, and configuration
- `frontend/InfoM/` – Static website files (HTML, CSS, JS, images)
- `.gitignore` – Ensures `node_modules`, `.env`, and other sensitive or generated files are not tracked

---

## Security & Best Practices

- **Never commit your `.env` file** or any secrets to GitHub. The `.gitignore` file ensures this is not tracked.
- **Do not upload `node_modules/`** — use `npm install` to regenerate dependencies.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Acknowledgements

- Built with Node.js, Express, MySQL, and vanilla JS/CSS/HTML.
- Inspired by the needs of event and venue management.
