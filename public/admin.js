document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = window.location.hostname.includes("railway.app")
        ? "https://book-arenafinal-production.up.railway.app"
        : "http://localhost:5000";

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";

    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Simple session with localStorage
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

    // --- Modal for viewing images ---
    if (!document.getElementById('imageModal')) {
        const modalHtml = `
        <div id="imageModal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); justify-content:center; align-items:center;">
            <span id="closeModal" style="position:absolute; top:40px; right:60px; color:white; font-size:2.5em; cursor:pointer;">&times;</span>
            <img id="modalImg" src="" style="max-width:85vw; max-height:85vh; border:6px solid white; border-radius:10px;" />
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
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

    // --- Bookings table code ---
    function loadBookingsTable() {
        const bookingsTableBody = document.getElementById('bookingsTableBody');
        fetch(`${API_BASE_URL}/api/bookings`)
            .then(res => res.json())
            .then(bookings => {
                bookingsTableBody.innerHTML = '';
                if (!bookings.length) {
                    bookingsTableBody.innerHTML = `<tr><td colspan="14" style="text-align:center; color:#aaa;">No bookings found.</td></tr>`;
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
                            <button class="delete-booking-btn" data-id="${b.id}" style="background:#ef4444;">Delete</button>
                        </td>
                      </tr>
                    `;
                });
            })
            .catch(() => {
                bookingsTableBody.innerHTML = `<tr><td colspan="14" style="text-align:center; color:#d44;">Failed to load bookings.</td></tr>`;
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
                            <button class="delete-contact-btn" data-id="${c.id}" style="background:#ef4444;">Delete</button>
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
                    // Format preferred dates to remove the time part, show only YYYY-MM-DD if present
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
                            <button class="delete-venue-btn" data-id="${app.id}" style="background:#ef4444;">Delete</button>
                        </td>
                      </tr>
                    `;
                });
            })
            .catch(() => {
                venueRentalTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center; color:#d44;">Failed to load venue rental applications.</td></tr>`;
            });
    }

    // --- Delete handlers for all tables ---
    document.getElementById('bookingsTableBody').onclick = function(e) {
        if (e.target && e.target.classList.contains('delete-booking-btn')) {
            const id = e.target.dataset.id;
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
    };

    document.getElementById('contactsTableBody').onclick = function(e) {
        if (e.target && e.target.classList.contains('delete-contact-btn')) {
            const id = e.target.dataset.id;
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
    };

    document.getElementById('venueRentalTableBody').onclick = function(e) {
        if (e.target && e.target.classList.contains('delete-venue-btn')) {
            const id = e.target.dataset.id;
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