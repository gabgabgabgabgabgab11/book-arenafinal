# Book Arena Final

A web application for booking arena events, submitting venue rental applications, and handling customer inquiries.

---

## Features

- **Book Events:** Users can book events at the arena, specify seating, ticket amount, and any special requirements.
- **Venue Rental Application:** Organizations can apply to rent the venue, submit event and company details, and specify facility needs.
- **Contact Form:** Users can send inquiries or messages to the arena management.

---

## Project Structure

```
backend/
  config/
  node_modules/
  routes/
    booking.js
    contact.js
    venueRental.js
  uploads/
  db.js
  app.js
  db_schema.sql
  package.json
  package-lock.json
  .env
frontend/InfoM/
  img/
  index.html
  styles.css
  venue.html
  venueRentalForm.js
.gitignore
```

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (Express)
- **Database:** MySQL

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/gabgabgabgabgabgab11/book-arenafinal.git
cd book-arenafinal
```

### 2. Install Backend Dependencies

```bash
cd backend
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
