export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  try {
    const b = req.body || {};
    if (b.website_confirm) return res.status(200).json({ok:true});
    const required = ['firstName','lastName','company','email','message'];
    if (required.some(k => typeof b[k] !== 'string' || !b[k].trim())) return res.status(400).json({message:'Complete all required fields'});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return res.status(400).json({message:'Invalid email'});
    if (JSON.stringify(b).length > 20000) return res.status(413).json({message:'Submission too long'});
    const webhook = process.env.MGI_LEAD_WEBHOOK_URL;
    if (webhook) {
      const response = await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
      if (!response.ok) throw new Error('Webhook delivery failed');
      return res.status(200).json({ok:true});
    }
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(503).json({message:'Delivery not configured'});
    const safe = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const html = '<h2>New MGI website inquiry</h2><table>' + Object.entries(b).filter(([k])=>k!=='website_confirm').map(([k,v])=>'<tr><th>'+safe(k)+'</th><td>'+safe(v)+'</td></tr>').join('') + '</table>';
    const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({from:'MGI Website <info@mgiglobalgroup.com>',to:['info@mgiglobalgroup.com'],reply_to:b.email,subject:'MGI website inquiry: '+b.company.slice(0,100),html})});
    if (!response.ok) return res.status(502).json({message:'Email delivery failed'});
    return res.status(200).json({ok:true});
  } catch (e) {
    console.error('Contact delivery failed');
    return res.status(500).json({message:'Unable to submit right now'});
  }
}
