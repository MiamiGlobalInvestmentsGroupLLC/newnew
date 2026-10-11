export default async function handler(req,res) {
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const b = req.body || {};
  const agents = Number(b.agents);
  if(!b.company || !b.email || !b.service || !Number.isInteger(agents) || agents<1 || agents>100) return res.status(400).json({error:'Invalid fields'});
  if(!process.env.RESEND_API_KEY) return res.status(503).json({error:'Service not configured'});
  const result = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({
      from:'MGI Website <info@mgiglobalgroup.com>',
      to:['info@mgiglobalgroup.com'],
      subject:'New team request',
      text:JSON.stringify(b)
    })
  });
  return res.status(result.ok?200:502).json(result.ok?{ok:true}:{error:'Delivery failed'});
}