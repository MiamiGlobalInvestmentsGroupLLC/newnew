import { getCertificate } from './certificate-store.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ found: false, error: 'Method not allowed' });
  }

  const serial = req.query?.serial;
  if (!serial) {
    return res.status(400).json({ found: false, error: 'Missing serial query parameter' });
  }

  const certificate = getCertificate(serial);
  if (!certificate) {
    return res.status(200).json({ found: false });
  }

  return res.status(200).json({ found: true, certificate });
}
