/* =========================================
   CONTACT.JS — Formspree form submission
                Inline success/error state
                No page reload
   ========================================= */

(function initContactForm() {

  var form   = document.getElementById('contact-form');
  var submit = document.getElementById('form-submit');
  var status = document.getElementById('form-status');

  if (!form || !submit || !status) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    /* Basic client-side validation */
    var name    = form.querySelector('[name="name"]');
    var email   = form.querySelector('[name="email"]');
    var message = form.querySelector('[name="message"]');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showStatus('error', 'Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email.value)) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }

    /* Loading state */
    submit.textContent = 'Sending…';
    submit.disabled = true;
    clearStatus();

    /* Submit via fetch */
    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' },
    })
      .then(function(res) {
        if (res.ok) {
          form.reset();
          showStatus('success', 'Message sent — I\'ll be in touch soon.');
          submit.textContent = 'Sent ✓';
          setTimeout(function() {
            submit.textContent = 'Send it →';
            submit.disabled = false;
          }, 4000);
        } else {
          return res.json().then(function(data) {
            throw new Error(data.error || 'Submission failed');
          });
        }
      })
      .catch(function(err) {
        showStatus('error', 'Something went wrong. Try emailing me directly.');
        submit.textContent = 'Try again';
        submit.disabled = false;
        console.error('[contact]', err);
      });
  });

  /* ---- Helpers ---- */

  function showStatus(type, message) {
    status.className = 'form-status ' + type;
    status.textContent = message;
  }

  function clearStatus() {
    status.className = 'form-status';
    status.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

})();
