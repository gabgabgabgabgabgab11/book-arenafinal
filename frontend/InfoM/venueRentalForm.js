document.addEventListener('DOMContentLoaded', function() {
  // Tab switching logic
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Modal close logic (X button)
  const closeModal = document.getElementById('closeModal');
  if (closeModal) {
    closeModal.onclick = function() {
      document.querySelector('.modal').style.display = 'none';
    };
  }

  // Cancel buttons redirect to main page
  document.querySelectorAll('.genz-btn-cancel').forEach(btn => {
    btn.onclick = function() {
      window.location.href = 'index.html'; // Redirect to main page
    }
  });

  // Next: Company Info → Event Details
  const nextToEventDetails = document.getElementById('nextToEventDetails');
  if (nextToEventDetails) {
    nextToEventDetails.onclick = function() {
      document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
      document.querySelector('.tab[data-tab="event-details"]').classList.add('active');
      document.getElementById('event-details').classList.add('active');
    };
  }

  // Next: Event Details → Technical Requirements
  const nextToTechReq = document.getElementById('nextToTechReq');
  if (nextToTechReq) {
    nextToTechReq.onclick = function() {
      document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
      document.querySelector('.tab[data-tab="technical-req"]').classList.add('active');
      document.getElementById('technical-req').classList.add('active');
    };
  }

  // Back button in Event Details
  const backToCompany = document.getElementById('backToCompanyInfo');
  if (backToCompany) {
    backToCompany.onclick = function() {
      document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
      document.querySelector('.tab[data-tab="company-info"]').classList.add('active');
      document.getElementById('company-info').classList.add('active');
    };
  }

  // Back button in Technical Requirements
  const backToEvent = document.getElementById('backToEventDetails');
  if (backToEvent) {
    backToEvent.onclick = function() {
      document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
      document.querySelector('.tab[data-tab="event-details"]').classList.add('active');
      document.getElementById('event-details').classList.add('active');
    };
  }

  // Submit logic for Technical Requirements tab
  const techReqForm = document.getElementById('techReqForm');
  if (techReqForm) {
    techReqForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      if (!document.getElementById('agreeTerms').checked) {
        alert('Please agree to the Terms and Conditions before submitting.');
        return;
      }

      const data = {
        companyName: document.getElementById('companyName').value,
        orgType: document.getElementById('orgType').value,
        businessAddress: document.getElementById('businessAddress').value,
        taxId: document.getElementById('taxId').value,
        contactPerson: document.getElementById('contactPerson').value,
        positionTitle: document.getElementById('positionTitle').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        companyBackground: document.getElementById('background').value,
        // Event Details
        eventTitle: document.getElementById('eventTitle').value,
        eventType: document.getElementById('eventType').value,
        eventDescription: document.getElementById('eventDescription').value,
        preferredDate1: document.getElementById('preferredDate1').value,
        preferredDate2: document.getElementById('preferredDate2').value,
        preferredDate3: document.getElementById('preferredDate3').value,
        eventDuration: document.getElementById('eventDuration').value,
        setupDays: document.getElementById('setupDays').value,
        expectedAttendance: document.getElementById('expectedAttendance').value,
        targetAudience: document.getElementById('targetAudience').value,
        // Technical Requirements
        stageReq: document.getElementById('stageReq').value,
        soundReq: document.getElementById('soundReq').value,
        lightingReq: document.getElementById('lightingReq').value,
        seatingArrangement: document.getElementById('seatingArrangement').value,
        customSeating: document.getElementById('customSeating').value,
        facilitiesNeeded: document.getElementById('facilitiesNeeded').value,
        cateringReq: document.getElementById('cateringReq').value,
        securityReq: document.getElementById('securityReq').value,
        additionalInfo: document.getElementById('additionalInfo').value,
        agreeTerms: document.getElementById('agreeTerms').checked
      };

      try {
        const response = await fetch('http://localhost:5000/api/venue-rental', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message || 'Application submitted!');
        } else {
          alert(result.message || 'Submission failed.');
        }
      } catch (err) {
        alert('Error submitting application.');
      }
    });
  }
});