// --- Simple front-end login system for admin page ---
document.addEventListener('DOMContentLoaded', function () {
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";

    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Simple session with localStorage (so reload doesn't show login again until tab closes)
    function isLoggedIn() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }
    function setLoggedIn() {
        localStorage.setItem('adminLoggedIn', 'true');
    }
    function logout() {
        localStorage.removeItem('adminLoggedIn');
        window.location.reload();
    }

    if (!isLoggedIn()) {
        // Show login overlay
        loginOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        // Hide login overlay
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
                // Optionally, you can show a success message here before hiding overlay
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
    // Insert modal HTML if not present
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

    // --- Bookings table code with correct property names and working image links ---
    function loadBookingsTable() {
        const bookingsTableBody = document.getElementById('bookingsTableBody');
        fetch('http://localhost:5000/api/bookings')
            .then(res => res.json())
            .then(bookings => {
                bookingsTableBody.innerHTML = '';
                if (!bookings.length) {
                    bookingsTableBody.innerHTML = `<tr><td colspan="13" style="text-align:center; color:#aaa;">No bookings found.</td></tr>`;
                    return;
                }
                bookings.forEach((b, idx) => {
                    // Use the exact keys coming from your backend's stored procedure
                    const eventName = b.event_name || '';
                    const eventDate = b.event_date || '';
                    const seatingType = b.seating_type || '';
                    const ticketAmount = b.ticket_amount || '';
                    const fullName = b.full_name || '';
                    const email = b.email || '';
                    const phone = b.phone || '';
                    const paymentMethod = b.payment_method || '';
                    const idImage = b.id_image || '';
                    const specialRequirements = b.special_requirements || '';
                    const createdAt = b.created_at || '';

                    // id_image already returned as `/uploads/filename.ext` by the backend
                    let idImageUrl = '';
                    if (idImage) {
                        if (idImage.startsWith('http')) {
                            idImageUrl = idImage;
                        } else {
                            idImageUrl = `http://localhost:5000${idImage}`;
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
                bookingsTableBody.innerHTML = `<tr><td colspan="13" style="text-align:center; color:#d44;">Failed to load bookings.</td></tr>`;
            });
    }

    document.getElementById('bookingsTableBody').onclick = function(e) {
    if (e.target && e.target.classList.contains('delete-booking-btn')) {
        const id = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this booking?')) {
            fetch(`http://localhost:5000/api/bookings/${id}`, {
                method: 'DELETE',
            })
            .then(res => res.json())
            .then(data => {
                // Refresh table
                loadBookingsTable();
            })
            .catch(() => {
                alert('Failed to delete booking.');
            });
        }
    }
};

    // Only load table if logged in
    if (isLoggedIn()) loadBookingsTable();

    // If login just succeeded, load table as well
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            if (document.getElementById('username').value === ADMIN_USERNAME &&
                document.getElementById('password').value === ADMIN_PASSWORD) {
                setTimeout(loadBookingsTable, 250);
            }
        });
    }

    // Make showModalImage globally available for inline onclick
    window.showModalImage = showModalImage;
});