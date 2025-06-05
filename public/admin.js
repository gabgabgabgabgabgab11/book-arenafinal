// admin.js
document.addEventListener('DOMContentLoaded', function () {
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
                bookingsTableBody.innerHTML += `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${b.id}</td>
                    <td>${b.event_name}</td>
                    <td>${b.event_date}</td>
                    <td>${b.seating_type || '<i style="color:#aaa;">N/A</i>'}</td>
                    <td>${b.ticket_amount}</td>
                    <td>${b.full_name || '<i style="color:#aaa;">N/A</i>'}</td>
                    <td>${b.email || '<i style="color:#aaa;">N/A</i>'}</td>
                    <td>${b.phone || '<i style="color:#aaa;">N/A</i>'}</td>
                    <td>${b.payment_method || '<i style="color:#aaa;">N/A</i>'}</td>
                    <td>
                        ${b.id_image ? `<a href="${b.id_image}" target="_blank">View</a>` : '<i style="color:#aaa;">N/A</i>'}
                    </td>
                    <td>${b.special_requirements || ''}</td>
                    <td>${b.created_at ? (new Date(b.created_at)).toLocaleString() : ''}</td>
                  </tr>
                `;
            });
        })
        .catch(() => {
            bookingsTableBody.innerHTML = `<tr><td colspan="13" style="text-align:center; color:#d44;">Failed to load bookings.</td></tr>`;
        });
});