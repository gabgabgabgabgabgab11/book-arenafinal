document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('open');
  });

  // Optional: Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
      navLinks.classList.remove('open');
    }
  });
});