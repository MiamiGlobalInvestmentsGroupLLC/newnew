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
    const labels = {firstName:'First name',lastName:'Last name',company:'Company',website:'Company website',email:'Work email',phone:'Phone',country:'Country',teamSize:'Requested team size',support:'Service requested',message:'Project details'};
    const fields = Object.entries(b).filter(([k,v]) => k !== 'website_confirm' && k in labels && v != null && String(v).trim());
    const rows = fields.map(([k,v],i) => '<tr style="background:'+(i%2?'#f8fafc':'#ffffff')+'"><td style="padding:13px 16px;border-bottom:1px solid #e5e7eb;color:#64748b;font-size:13px;width:36%;vertical-align:top">'+safe(labels[k])+'</td><td style="padding:13px 16px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere">'+safe(v)+'</td></tr>').join('');
    const fullName = [b.firstName,b.lastName].map(x=>String(x||'').trim()).join(' ');
    const replyLink = 'mailto:'+encodeURIComponent(b.email)+'?subject='+encodeURIComponent('Re: Your MGI outsourcing inquiry');
    const html = '<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a"><div style="max-width:640px;margin:32px auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden"><div style="background:#0c2340;padding:26px 30px;color:#fff"><div style="font-size:12px;letter-spacing:2px;font-weight:700;color:#cbd5e1">MIAMI GLOBAL INVESTMENTS GROUP</div><h1 style="margin:12px 0 0;font-size:25px;color:#fff">New website inquiry</h1></div><div style="padding:26px 30px"><p style="margin:0 0 18px;font-size:15px">A new inquiry was submitted through the MGI website by <strong>'+safe(fullName)+'</strong> at <strong>'+safe(b.company)+'</strong>.</p><a href="'+safe(replyLink)+'" style="display:inline-block;padding:12px 18px;background:#0c2340;color:#fff;text-decoration:none;border-radius:6px;font-weight:700">Reply to lead →</a><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:24px">'+rows+'</table></div><div style="padding:18px 30px;background:#f8fafc;color:#64748b;font-size:12px">MGI Website · Contact form submission</div></div></body></html>';
    const textBody = 'New MGI website inquiry\\n\\n'+fields.map(([k,v])=>labels[k]+': '+String(v)).join('\\n')+'\\n\\nReply to: '+b.email;
    const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({from:'MGI Website <info@mgiglobalgroup.com>',to:['info@mgiglobalgroup.com'],reply_to:b.email,subject:'New MGI lead: '+b.company.slice(0,100),html,text:textBody})});
    if (!response.ok) return res.status(502).json({message:'Email delivery failed'});
    return res.status(200).json({ok:true});
  } catch (e) {
    console.error('Contact delivery failed');
    return res.status(500).json({message:'Unable to submit right now'});
  }
}
