document.querySelectorAll('.involvement-form').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || form.dataset.sending === 'true') return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    form.dataset.sending = 'true';
    button.disabled = true;
    button.textContent = 'Sending…';
    status.className = 'form-status';
    status.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/leo@boulderculture.org', {
        method: 'POST', headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(data), signal: controller.signal
      });
      const result = await response.json();
      const message = String(result.message || '');
      if (/activat|confirm.*email|verify/i.test(message)) {
        throw new Error('This form is awaiting inbox activation. Please try again after it is activated, or write to leo@boulderculture.org.');
      }
      if (!response.ok || !(result.success === true || result.success === 'true')) {
        throw new Error('Your message could not be sent. Please try again, or write to leo@boulderculture.org.');
      }
      status.className = 'form-status success';
      status.textContent = 'Thanks! Your message was submitted to Leo. We’ll be in touch.';
      form.reset();
    } catch(error) {
      status.className = 'form-status error';
      status.textContent = error.name === 'AbortError'
        ? 'We couldn’t confirm whether your message was sent. Your text is still here. Try again, or write to leo@boulderculture.org.'
        : (error.message.includes('activation') || error.message.includes('could not be sent') ? error.message : 'Couldn’t connect. Your text is still here. Try again, or write to leo@boulderculture.org.');
    } finally {
      clearTimeout(timeout);
      form.dataset.sending = 'false';
      button.disabled = false;
      button.textContent = 'Send message';
    }
  });
});