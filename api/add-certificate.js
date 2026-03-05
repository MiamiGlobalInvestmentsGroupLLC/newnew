import { addCertificate } from './certificate-store.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { fullName, courseEn, courseAr, issueDate, notesEn = '', notesAr = '' } = body;

  if (!fullName || !courseEn || !courseAr || !issueDate) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: fullName, courseEn, courseAr, issueDate'
    });
  }

  const certificate = addCertificate({ fullName, courseEn, courseAr, issueDate, notesEn, notesAr });

  return res.status(200).json({
    success: true,
    serial: certificate.serial
  });
}
