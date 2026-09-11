/* =========================================
   CONTACT.JS — Form submission

   Posts to Formspree when it's configured. While the action still holds the
   YOUR_FORM_ID placeholder, falls back to opening the visitor's mail client
   so the form is never a dead end.

   Validation is per-field: each input gets aria-invalid and its own message,
   rather than one summary line that doesn't say which field is wrong.
   ========================================= */

(function initContactForm() {

  var form   = document.getElementById('contact-form');
  var submit = document.getElementById('form-submit');
  var status = document.getElementById('form-status');

  if (!form || !submit || !status) return;

  var fields = ['name', 'email', 'message'].map(function(key) {
    return {
      key: key,
      input: form.querySelector('[name="' + key + '"]'),
      error: document.getElementById('form-' + key + '-error'),
    };
  }).filter(function(f) { return f.input; });

  var isConfigured = form.action.indexOf('YOUR_FORM_ID') === -1;
  var fallbackEmail = form.getAttribute('data-fallback-email');

  var LABELS = { name: 'your name', email: 'your email', message: 'a message' };

  /* ---- Submit ---- */

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validate()) return;

    if (!isConfigured && fallbackEmail) {
      sendViaMailClient();
      return;
    }

    postToFormspree();
  });

  /* Clear a field's error as soon as it's corrected — waiting for the next
     submit to remove a red border feels broken. */
  fields.forEach(function(f) {
    f.input.addEventListener('input', function() {
      if (f.input.getAttribute('aria-invalid') === 'true' && !errorFor(f)) {
        clearFieldError(f);
      }
    });
    f.input.addEventListener('blur', function() {
      if (f.input.value.trim()) setFieldError(f, errorFor(f));
    });
  });

  /* ---- Validation ---- */

  function errorFor(f) {
    var value = f.input.value.trim();
    if (!value) return 'Please enter ' + LABELS[f.key] + '.';
    if (f.key === 'email' && !isValidEmail(value)) return 'That doesn’t look like a valid email address.';
    return '';
  }

  function validate() {
    var firstInvalid = null;

    fields.forEach(function(f) {
      var message = errorFor(f);
      setFieldError(f, message);
      if (message && !firstInvalid) firstInvalid = f;
    });

    if (firstInvalid) {
      clearStatus();
      /* Move the user to the problem rather than making them hunt for it */
      firstInvalid.input.focus();
      return false;
    }
    return true;
  }

  function setFieldError(f, message) {
    if (message) {
      f.input.setAttribute('aria-invalid', 'true');
      if (f.error) f.error.textContent = message;
    } else {
      clearFieldError(f);
    }
  }

  function clearFieldError(f) {
    f.input.removeAttribute('aria-invalid');
    if (f.error) f.error.textContent = '';
  }

  /* ---- Transports ---- */

  function postToFormspree() {
    setBusy(true);
    clearStatus();

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
    })
      .then(function(res) {
        if (!res.ok) {
          return res.json().then(function(data) {
            throw new Error(data.error || 'Submission failed');
          });
        }
        form.reset();
        fields.forEach(clearFieldError);
        showStatus('success', 'Message sent — I’ll be in touch soon.');
        submit.textContent = 'Sent ✓';
        setTimeout(function() {
          submit.textContent = 'Send it →';
          setBusy(false);
        }, 4000);
      })
      .catch(function(err) {
        var reach = fallbackEmail ? ' Try emailing me at ' + fallbackEmail + '.' : '';
        showStatus('error', 'Something went wrong.' + reach);
        submit.textContent = 'Try again';
        setBusy(false);
        console.error('[contact]', err);
      });
  }

  function sendViaMailClient() {
    var get = function(key) {
      var f = fields.filter(function(x) { return x.key === key; })[0];
      return f ? f.input.value.trim() : '';
    };

    var subject = 'Website enquiry from ' + get('name');
    var body = get('message') + '\n\n— ' + get('name') + ' (' + get('email') + ')';

    window.location.href =
      'mailto:' + fallbackEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    showStatus('success', 'Opening your email app — hit send there and it’s on its way.');
  }

  /* ---- Helpers ---- */

  function setBusy(busy) {
    submit.disabled = busy;
    if (busy) {
      submit.textContent = 'Sending…';
      submit.setAttribute('aria-busy', 'true');
    } else {
      submit.removeAttribute('aria-busy');
    }
  }

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
