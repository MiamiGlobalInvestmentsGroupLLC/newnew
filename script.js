// Set year
document.querySelectorAll('#y').forEach(el => el.textContent = new Date().getFullYear());
// Contact form handler
const form = document.getElementById('contactForm');
if (form) {
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  const mailtoFallback = document.getElementById('mailtoFallback');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.textContent='';
    submitBtn.disabled = true;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) {
      formMsg.textContent = 'Please fill the required fields (*)';
      submitBtn.disabled = false; return;
    }
    try {
      const res = await fetch('api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Network error');
      await res.json();
      formMsg.textContent = 'Thanks! We’ll get back to you very soon.';
      form.reset();
    } catch(err){
      formMsg.textContent = 'Couldn’t send via server. Use your email app:';
      mailtoFallback.classList.remove('hidden');
      const subject = encodeURIComponent('New Inquiry — MGI Website');
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\nService: ${data.service || ''}\n\nMessage:\n${data.message}`
      );
      mailtoFallback.href = `mailto:Info@miamiglobalgroup.com?subject=${subject}&body=${body}`;
    } finally { submitBtn.disabled = false; }
  });
}
