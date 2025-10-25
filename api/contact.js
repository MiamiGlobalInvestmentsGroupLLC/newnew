export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, email, phone = '', service = '', message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Email service not configured' });
    const payload = {
      from: 'MGI Website <noreply@miamiglobalgroup.com>',
      to: ['Info@miamiglobalgroup.com'],
      subject: 'New Inquiry — MGI Website',
      text:
`Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}`
    };
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) { const t = await r.text(); return res.status(502).json({ error: 'Resend error', detail: t }); }
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(500).json({ error: 'Server error' }); }
}
