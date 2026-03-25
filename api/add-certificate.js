export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  console.warn('[add-certificate] disabled in production verification flow. Source of truth is assets/data/certificates.json');
  return res.status(410).json({
    success: false,
    error: 'Certificate auto-publish API is disabled. Use assets/data/certificates.json as the single source of truth.'
  });
}
