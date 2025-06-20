document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = window.location.hostname.includes("railway.app")
        ? "https://book-arenafinal-production.up.railway.app"
        : "http://localhost:5000";

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";

    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // --- Session logic ---
    function isLoggedIn() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }
    function setLoggedIn() {
        localStorage.setItem('adminLoggedIn', 'true');
    }

    if (!isLoggedIn()) {
        loginOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        if (loginOverlay) loginOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (loginForm) {
        loginForm.onsubmit = function (e) {
            e.preventDefault();
            errorMessage.style.display = "none";
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                setLoggedIn();
                loginOverlay.style.display = 'none';
                document.body.style.overflow = '';
            } else {
                errorMessage.style.display = "block";
            }
        }
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('adminLoggedIn');
            window.location.reload();
        };
    }

    // --- Modal HTML for all tables (image, view, edit for bookings, contacts, venue) ---
    if (!document.getElementById('imageModal')) {
        const modalHtml = `
        <div id="imageModal" class="custom-modal" style="display:none;">
            <span id="closeModal" class="custom-modal-close">&times;</span>
            <img id="modalImg" src="" class="custom-modal-img" />
        </div>
        <div id="viewModal" class="custom-modal" style="display:none;">
            <span id="closeViewModal" class="custom-modal-close">&times;</span>
            <div id="viewModalContent" class="custom-modal-content"></div>
        </div>
        <div id="editModal" class="custom-modal" style="display:none;">
            <span id="closeEditModal" class="custom-modal-close">&times;</span>
            <form id="editBookingForm" class="custom-modal-content"></form>
        </div>
        <div id="contactViewModal" class="custom-modal" style="display:none;">
            <span id="closeContactViewModal" class="custom-modal-close">&times;</span>
            <div id="contactViewContent" class="custom-modal-content"></div>
        </div>
        <div id="contactEditModal" class="custom-modal" style="display:none;">
            <span id="closeContactEditModal" class="custom-modal-close">&times;</span>
            <form id="editContactForm" class="custom-modal-content"></form>
        </div>
        <div id="venueViewModal" class="custom-modal" style="display:none;">
            <span id="closeVenueViewModal" class="custom-modal-close">&times;</span>
            <div id="venueViewContent" class="custom-modal-content"></div>
        </div>
        <div id="venueEditModal" class="custom-modal" style="display:none;">
            <span id="closeVenueEditModal" class="custom-modal-close">&times;</span>
            <form id="editVenueForm" class="custom-modal-content"></form>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    // --- Modal image logic ---
    function showModalImage(url) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImg');
        modalImg.src = url;
        modal.style.display = 'flex';
    }
    document.getElementById('closeModal').onclick = function() {
        document.getElementById('imageModal').style.display = 'none';
        document.getElementById('modalImg').src = "";
    };
    document.getElementById('imageModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('modalImg').src = "";
        }
    };

    // --- Booking View/Edit ---
    function showViewModal(booking) {
        const modal = document.getElementById('viewModal');
        const content = document.getElementById('viewModalContent');
        content.innerHTML = `
            <h2 style="margin-bottom:12px;">Booking Details</h2>
            <table style="width:100%;border-spacing:0;border-collapse:collapse;">
                <tr><th>Booking ID:</th><td>${booking.id}</td></tr>
                <tr><th>Event Name:</th><td>${booking.event_name || booking.eventName || ''}</td></tr>
                <tr><th>Event Date:</th><td>${booking.event_date || booking.eventDate || ''}</td></tr>
                <tr><th>Seating Type:</th><td>${booking.seating_type || booking.seatingType || ''}</td></tr>
                <tr><th>Ticket Amount:</th><td>${booking.ticket_amount || booking.ticketAmount || ''}</td></tr>
                <tr><th>Full Name:</th><td>${booking.full_name || booking.fullName || ''}</td></tr>
                <tr><th>Email:</th><td>${booking.email || ''}</td></tr>
                <tr><th>Phone:</th><td>${booking.phone || ''}</td></tr>
                <tr><th>Payment Method:</th><td>${booking.payment_method || booking.paymentMethod || ''}</td></tr>
                <tr><th>Special Requirements:</th><td>${booking.special_requirements || booking.specialRequirements || ''}</td></tr>
                <tr><th>Booked At:</th><td>${booking.created_at ? (new Date(booking.created_at)).toLocaleString() : ''}</td></tr>
                <tr>
                  <th>ID Image:</th>
                  <td>
                    ${(booking.id_image || booking.idImage) ? `<img src="${API_BASE_URL}${booking.id_image || booking.idImage}" style="max-width:200px;max-height:150px;border:2px solid #ccc;border-radius:7px;" alt="ID Image"/>` : '<i style="color:#aaa;">N/A</i>'}
                  </td>
                </tr>
            </table>
        `;
        modal.style.display = 'flex';
    }
    document.getElementById('closeViewModal').onclick = function() {
        document.getElementById('viewModal').style.display = 'none';
        document.getElementById('viewModalContent').innerHTML = "";
    };
    document.getElementById('viewModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('viewModalContent').innerHTML = "";
        }
    };

    function showEditModal(booking) {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editBookingForm');
        form.innerHTML = `
            <h2 style="margin-bottom:12px;">Edit Booking</h2>
            <label>Special Requirements:<br><textarea name="special_requirements">${booking.special_requirements || booking.specialRequirements || ''}</textarea></label><br>
            <button type="submit" class="action-btn edit-btn" style="margin-top:10px;">Save</button>
        `;
        form.onsubmit = function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const updated = {};
            formData.forEach((v, k) => updated[k] = v);

            fetch(`${API_BASE_URL}/api/bookings/${booking.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            })
            .then(res => res.json())
            .then(res => {
                modal.style.display = 'none';
                loadBookingsTable();
                alert('Booking updated!');
            })
            .catch(() => {
                alert('Failed to update booking!');
            });
        };
        modal.style.display = 'flex';
    }
    document.getElementById('closeEditModal').onclick = function() {
        document.getElementById('editModal').style.display = 'none';
        document.getElementById('editBookingForm').innerHTML = "";
    };
    document.getElementById('editModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('editBookingForm').innerHTML = "";
        }
    };

    // --- Contact View/Edit ---
    function showContactViewModal(contact) {
        const modal = document.getElementById('contactViewModal');
        const content = document.getElementById('contactViewContent');
        content.innerHTML = `
            <h2 style="margin-bottom:12px;">Contact Details</h2>
            <table style="width:100%;border-spacing:0;border-collapse:collapse;">
                <tr><th>Contact ID:</th><td>${contact.id}</td></tr>
                <tr><th>Name:</th><td>${contact.name || ''}</td></tr>
                <tr><th>Email:</th><td>${contact.email || ''}</td></tr>
                <tr><th>Phone:</th><td>${(contact.countryCode ? (contact.countryCode + " ") : "") + (contact.phone || '')}</td></tr>
                <tr><th>Inquiry Type:</th><td>${contact.inquiryType || contact.inquiry_type || ''}</td></tr>
                <tr><th>Message:</th><td>${contact.message || ''}</td></tr>
                <tr><th>Submitted At:</th><td>${contact.created_at ? (new Date(contact.created_at)).toLocaleString() : ''}</td></tr>
            </table>
        `;
        modal.style.display = 'flex';
    }
    document.getElementById('closeContactViewModal').onclick = function() {
        document.getElementById('contactViewModal').style.display = 'none';
        document.getElementById('contactViewContent').innerHTML = "";
    };
    document.getElementById('contactViewModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('contactViewContent').innerHTML = "";
        }
    };

    function showContactEditModal(contact) {
        const modal = document.getElementById('contactEditModal');
        const form = document.getElementById('editContactForm');
        form.innerHTML = `
            <h2 style="margin-bottom:12px;">Edit Contact</h2>
            <label>Name:<br><input type="text" name="name" value="${contact.name || ''}" required /></label><br>
            <label>Email:<br><input type="email" name="email" value="${contact.email || ''}" required /></label><br>
            <label>Phone:<br><input type="text" name="phone" value="${contact.phone || ''}" /></label><br>
            <label>Inquiry Type:<br><input type="text" name="inquiryType" value="${contact.inquiryType || contact.inquiry_type || ''}" /></label><br>
            <label>Message:<br><textarea name="message">${contact.message || ''}</textarea></label><br>
            <button type="submit" class="action-btn edit-btn" style="margin-top:10px;">Save</button>
        `;
        form.onsubmit = function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const updated = {};
            formData.forEach((v, k) => updated[k] = v);

            fetch(`${API_BASE_URL}/api/contacts/${contact.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            })
            .then(res => res.json())
            .then(res => {
                modal.style.display = 'none';
                loadContactsTable();
                alert('Contact updated!');
            })
            .catch(() => {
                alert('Failed to update contact!');
            });
        };
        modal.style.display = 'flex';
    }
    document.getElementById('closeContactEditModal').onclick = function() {
        document.getElementById('contactEditModal').style.display = 'none';
        document.getElementById('editContactForm').innerHTML = "";
    };
    document.getElementById('contactEditModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('editContactForm').innerHTML = "";
        }
    };

    // --- Venue View/Edit ---
    function showVenueViewModal(app) {
        const modal = document.getElementById('venueViewModal');
        const content = document.getElementById('venueViewContent');
        content.innerHTML = `
            <h2 style="margin-bottom:12px;">Venue Rental Application</h2>
            <table style="width:100%;border-spacing:0;border-collapse:collapse;">
                <tr><th>Application ID:</th><td>${app.id}</td></tr>
                <tr><th>Company Name:</th><td>${app.company_name || ''}</td></tr>
                <tr><th>Contact Person:</th><td>${app.contact_person || ''}</td></tr>
                <tr><th>Email:</th><td>${app.email || ''}</td></tr>
                <tr><th>Phone:</th><td>${app.phone || ''}</td></tr>
                <tr><th>Event Title:</th><td>${app.event_title || ''}</td></tr>
                <tr><th>Event Type:</th><td>${app.event_type || ''}</td></tr>
                <tr><th>Preferred Dates:</th><td>${[app.preferred_date_1, app.preferred_date_2, app.preferred_date_3].filter(Boolean).map(dt => dt ? dt.split('T')[0] : '').join(', ')}</td></tr>
                <tr><th>Expected Attendance:</th><td>${app.expected_attendance || ''}</td></tr>
                <tr><th>Stage:</th><td>${app.stage_req || ''}</td></tr>
                <tr><th>Sound:</th><td>${app.sound_req || ''}</td></tr>
                <tr><th>Lighting:</th><td>${app.lighting_req || ''}</td></tr>
                <tr><th>Catering:</th><td>${app.catering_req || ''}</td></tr>
                <tr><th>Security:</th><td>${app.security_req || ''}</td></tr>
                <tr><th>Submitted At:</th><td>${app.submitted_at ? (new Date(app.submitted_at)).toLocaleString() : ''}</td></tr>
            </table>
        `;
        modal.style.display = 'flex';
    }
    document.getElementById('closeVenueViewModal').onclick = function() {
        document.getElementById('venueViewModal').style.display = 'none';
        document.getElementById('venueViewContent').innerHTML = "";
    };
    document.getElementById('venueViewModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('venueViewContent').innerHTML = "";
        }
    };

    function showVenueEditModal(app) {
        const modal = document.getElementById('venueEditModal');
        const form = document.getElementById('editVenueForm');
        form.innerHTML = `
            <h2 style="margin-bottom:12px;">Edit Venue Rental Application</h2>
            <label>Company Name:<br><input type="text" name="company_name" value="${app.company_name || ''}" required /></label><br>
            <label>Contact Person:<br><input type="text" name="contact_person" value="${app.contact_person || ''}" required /></label><br>
            <label>Email:<br><input type="email" name="email" value="${app.email || ''}" required /></label><br>
            <label>Phone:<br><input type="text" name="phone" value="${app.phone || ''}" /></label><br>
            <label>Event Title:<br><input type="text" name="event_title" value="${app.event_title || ''}" /></label><br>
            <label>Event Type:<br><input type="text" name="event_type" value="${app.event_type || ''}" /></label><br>
            <label>Preferred Date 1:<br><input type="date" name="preferred_date_1" value="${app.preferred_date_1 ? app.preferred_date_1.split('T')[0] : ''}" /></label><br>
            <label>Preferred Date 2:<br><input type="date" name="preferred_date_2" value="${app.preferred_date_2 ? app.preferred_date_2.split('T')[0] : ''}" /></label><br>
            <label>Preferred Date 3:<br><input type="date" name="preferred_date_3" value="${app.preferred_date_3 ? app.preferred_date_3.split('T')[0] : ''}" /></label><br>
            <label>Expected Attendance:<br><input type="number" name="expected_attendance" value="${app.expected_attendance || ''}" /></label><br>
            <label>Stage:<br><input type="text" name="stage_req" value="${app.stage_req || ''}" /></label><br>
            <label>Sound:<br><input type="text" name="sound_req" value="${app.sound_req || ''}" /></label><br>
            <label>Lighting:<br><input type="text" name="lighting_req" value="${app.lighting_req || ''}" /></label><br>
            <label>Catering:<br><input type="text" name="catering_req" value="${app.catering_req || ''}" /></label><br>
            <label>Security:<br><input type="text" name="security_req" value="${app.security_req || ''}" /></label><br>
            <button type="submit" class="action-btn edit-btn" style="margin-top:10px;">Save</button>
        `;
        form.onsubmit = function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const updated = {};
            formData.forEach((v, k) => updated[k] = v);

            fetch(`${API_BASE_URL}/api/venue-rental/${app.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            })
            .then(res => res.json())
            .then(res => {
                modal.style.display = 'none';
                loadVenueRentalTable();
                alert('Venue application updated!');
            })
            .catch(() => {
                alert('Failed to update venue application!');
            });
        };
        modal.style.display = 'flex';
    }
    document.getElementById('closeVenueEditModal').onclick = function() {
        document.getElementById('venueEditModal').style.display = 'none';
        document.getElementById('editVenueForm').innerHTML = "";
    };
    document.getElementById('venueEditModal').onclick = function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.getElementById('editVenueForm').innerHTML = "";
        }
    };

    // --- Bookings table code ---
    function loadBookingsTable() {
        const bookingsTableBody = document.getElementById('bookingsTableBody');
        fetch(`${API_BASE_URL}/api/bookings`)
            .then(res => res.json())
            .then(bookings => {
                bookingsTableBody.innerHTML = '';
                if (!bookings.length) {
                    bookingsTableBody.innerHTML = `<tr><td colspan="16" style="text-align:center; color:#aaa;">No bookings found.</td></tr>`;
                    return;
                }
                bookings.forEach((b, idx) => {
                    const eventName = b.event_name || b.eventName || '';
                    const eventDate = b.event_date || b.eventDate || '';
                    const seatingType = b.seating_type || b.seatingType || '';
                    const ticketAmount = b.ticket_amount || b.ticketAmount || '';
                    const fullName = b.full_name || b.fullName || '';
                    const email = b.email || '';
                    const phone = b.phone || '';
                    const paymentMethod = b.payment_method || b.paymentMethod || '';
                    const idImage = b.id_image || b.idImage || '';
                    const specialRequirements = b.special_requirements || b.specialRequirements || '';
                    const createdAt = b.created_at || b.bookedAt || b.createdAt || '';

                    let idImageUrl = '';
                    if (idImage) {
                        if (idImage.startsWith('http')) {
                            idImageUrl = idImage;
                        } else {
                            idImageUrl = `${API_BASE_URL}${idImage}`;
                        }
                    }

                    bookingsTableBody.innerHTML += `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>${b.id}</td>
                        <td>${eventName}</td>
                        <td>${eventDate}</td>
                        <td>${seatingType ? seatingType : '<i style="color:#aaa;">N/A</i>'}</td>
                        <td>${ticketAmount ? ticketAmount : '<i style="color:#aaa;">N/A</i>'}</td>
                        <td>${fullName ? fullName : '<i style="color:#aaa;">N/A</i>'}</td>
                        <td>${email ? email : '<i style="color:#aaa;">N/A</i>'}</td>
                        <td>${phone ? phone : '<i style="color:#aaa;">N/A</i>'}</td>
                        <td>${paymentMethod ? paymentMethod : '<i style="color:#aaa;">N/A</i>'}</td>
                        <td>
                            ${idImageUrl ? `<a href="#" onclick="showModalImage('${idImageUrl}');return false;">View</a>` : '<i style="color:#aaa;">N/A</i>'}
                        </td>
                        <td>${specialRequirements ? specialRequirements : ''}</td>
                        <td>${createdAt ? (new Date(createdAt)).toLocaleString() : ''}</td>
                        <td>
                            <button class="view-booking-btn action-btn view-btn" data-id="${b.id}">View</button>
                            <button class="edit-booking-btn action-btn edit-btn" data-id="${b.id}">Edit</button>
                            <button class="delete-booking-btn action-btn delete-btn" data-id="${b.id}">Delete</button>
                        </td>
                      </tr>
                    `;
                });
            })
            .catch(() => {
                bookingsTableBody.innerHTML = `<tr><td colspan="16" style="text-align:center; color:#d44;">Failed to load bookings.</td></tr>`;
            });
    }

    // --- Contacts table code ---
    function loadContactsTable() {
        const contactsTableBody = document.getElementById('contactsTableBody');
        fetch(`${API_BASE_URL}/api/contacts`)
            .then(res => res.json())
            .then(contacts => {
                contactsTableBody.innerHTML = '';
                if (!contacts.length) {
                    contactsTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#aaa;">No contacts found.</td></tr>`;
                    return;
                }
                contacts.forEach((c, idx) => {
                    const name = c.name || '';
                    const email = c.email || '';
                    const phone = (c.countryCode ? (c.countryCode + " ") : "") + (c.phone || '');
                    const inquiryType = c.inquiryType || c.inquiry_type || '';
                    const message = c.message || '';
                    const createdAt = c.created_at || c.createdAt || '';
                    contactsTableBody.innerHTML += `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>${c.id}</td>
                        <td>${name}</td>
                        <td>${email}</td>
                        <td>${phone}</td>
                        <td>${inquiryType}</td>
                        <td>${message}</td>
                        <td>${createdAt ? (new Date(createdAt)).toLocaleString() : ''}</td>
                        <td>
                            <button class="view-contact-btn action-btn view-btn" data-id="${c.id}">View</button>
                            <button class="edit-contact-btn action-btn edit-btn" data-id="${c.id}">Edit</button>
                            <button class="delete-contact-btn action-btn delete-btn" data-id="${c.id}">Delete</button>
                        </td>
                      </tr>
                    `;
                });
            })
            .catch(() => {
                contactsTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#d44;">Failed to load contacts.</td></tr>`;
            });
    }

    // --- Venue Rental Applications table code ---
    function loadVenueRentalTable() {
        const venueRentalTableBody = document.getElementById('venueRentalTableBody');
        fetch(`${API_BASE_URL}/api/venue-rental`)
            .then(res => res.json())
            .then(applications => {
                venueRentalTableBody.innerHTML = '';
                if (!applications.length) {
                    venueRentalTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center; color:#aaa;">No venue rental applications found.</td></tr>`;
                    return;
                }
                applications.forEach((app, idx) => {
                    const company_name = app.company_name || '';
                    const contact_person = app.contact_person || '';
                    const email = app.email || '';
                    const phone = app.phone || '';
                    const event_title = app.event_title || '';
                    const event_type = app.event_type || '';
                    const formatDate = (dt) => dt ? (typeof dt === 'string' ? dt.split('T')[0] : new Date(dt).toISOString().split('T')[0]) : '';
                    const preferred_dates = [app.preferred_date_1, app.preferred_date_2, app.preferred_date_3]
                        .filter(Boolean)
                        .map(formatDate)
                        .join('<br>');
                    const expected_attendance = app.expected_attendance || '';
                    const stage_req = app.stage_req || '';
                    const sound_req = app.sound_req || '';
                    const lighting_req = app.lighting_req || '';
                    const catering_req = app.catering_req || '';
                    const security_req = app.security_req || '';
                    const submitted_at = app.submitted_at || '';

                    venueRentalTableBody.innerHTML += `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>${app.id || ''}</td>
                        <td>${company_name}</td>
                        <td>${contact_person}</td>
                        <td>${email}</td>
                        <td>${phone}</td>
                        <td>${event_title}</td>
                        <td>${event_type}</td>
                        <td>${preferred_dates}</td>
                        <td>${expected_attendance}</td>
                        <td>${stage_req}</td>
                        <td>${sound_req}</td>
                        <td>${lighting_req}</td>
                        <td>${catering_req}</td>
                        <td>${security_req}</td>
                        <td>${submitted_at ? (new Date(submitted_at)).toLocaleString() : ''}</td>
                        <td>
                            <button class="view-venue-btn action-btn view-btn" data-id="${app.id}">View</button>
                            <button class="edit-venue-btn action-btn edit-btn" data-id="${app.id}">Edit</button>
                            <button class="delete-venue-btn action-btn delete-btn" data-id="${app.id}">Delete</button>
                        </td>
                      </tr>
                    `;
                });
            })
            .catch(() => {
                venueRentalTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center; color:#d44;">Failed to load venue rental applications.</td></tr>`;
            });
    }

    // --- Button handler for bookings table (View/Edit/Delete) ---
    document.getElementById('bookingsTableBody').onclick = function(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-booking-btn')) {
            if (confirm('Are you sure you want to delete this booking?')) {
                fetch(`${API_BASE_URL}/api/bookings/${id}`, {
                    method: 'DELETE',
                })
                .then(res => res.json())
                .then(() => {
                    loadBookingsTable();
                })
                .catch(() => {
                    alert('Failed to delete booking.');
                });
            }
        }
        if (e.target.classList.contains('view-booking-btn')) {
            fetch(`${API_BASE_URL}/api/bookings`)
                .then(res => res.json())
                .then(bookings => {
                    const booking = bookings.find(b => b.id == id);
                    if (booking) showViewModal(booking);
                });
        }
        if (e.target.classList.contains('edit-booking-btn')) {
            fetch(`${API_BASE_URL}/api/bookings`)
                .then(res => res.json())
                .then(bookings => {
                    const booking = bookings.find(b => b.id == id);
                    if (booking) showEditModal(booking);
                });
        }
    };

    // --- Contacts table handlers (View/Edit/Delete) ---
    document.getElementById('contactsTableBody').onclick = function(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-contact-btn')) {
            if (confirm('Are you sure you want to delete this contact?')) {
                fetch(`${API_BASE_URL}/api/contacts/${id}`, {
                    method: 'DELETE',
                })
                .then(res => res.json())
                .then(() => {
                    loadContactsTable();
                })
                .catch(() => {
                    alert('Failed to delete contact.');
                });
            }
        }
        if (e.target.classList.contains('view-contact-btn')) {
            fetch(`${API_BASE_URL}/api/contacts`)
                .then(res => res.json())
                .then(contacts => {
                    const contact = contacts.find(c => c.id == id);
                    if (contact) showContactViewModal(contact);
                });
        }
        if (e.target.classList.contains('edit-contact-btn')) {
            fetch(`${API_BASE_URL}/api/contacts`)
                .then(res => res.json())
                .then(contacts => {
                    const contact = contacts.find(c => c.id == id);
                    if (contact) showContactEditModal(contact);
                });
        }
    };

    // --- Venue Rental table handlers (View/Edit/Delete) ---
    document.getElementById('venueRentalTableBody').onclick = function(e) {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-venue-btn')) {
            if (confirm('Are you sure you want to delete this venue rental application?')) {
                fetch(`${API_BASE_URL}/api/venue-rental/${id}`, {
                    method: 'DELETE',
                })
                .then(res => res.json())
                .then(() => {
                    loadVenueRentalTable();
                })
                .catch(() => {
                    alert('Failed to delete venue rental application.');
                });
            }
        }
        if (e.target.classList.contains('view-venue-btn')) {
            fetch(`${API_BASE_URL}/api/venue-rental`)
                .then(res => res.json())
                .then(applications => {
                    const app = applications.find(a => a.id == id);
                    if (app) showVenueViewModal(app);
                });
        }
        if (e.target.classList.contains('edit-venue-btn')) {
            fetch(`${API_BASE_URL}/api/venue-rental`)
                .then(res => res.json())
                .then(applications => {
                    const app = applications.find(a => a.id == id);
                    if (app) showVenueEditModal(app);
                });
        }
    };

    if (isLoggedIn()) {
        loadBookingsTable();
        loadContactsTable();
        loadVenueRentalTable();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            if (document.getElementById('username').value === ADMIN_USERNAME &&
                document.getElementById('password').value === ADMIN_PASSWORD) {
                setTimeout(() => {
                    loadBookingsTable();
                    loadContactsTable();
                    loadVenueRentalTable();
                }, 250);
            }
        });
    }

    window.showModalImage = showModalImage;
});