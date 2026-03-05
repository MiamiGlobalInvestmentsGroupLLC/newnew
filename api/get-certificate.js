import { getCertificate } from './certificate-store.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ found: false, error: 'Method not allowed' });
  }

  const serial = req.query?.serial;
  const lastName = req.query?.lastName;

  if (!serial || !lastName) {
    return res.status(400).json({ found: false, error: 'Missing serial or lastName query parameter' });
  }

  const certificate = getCertificate(serial, lastName);
  if (!certificate) {
    return res.status(200).json({ found: false });
  }

  return res.status(200).json({ found: true, certificate });
}
