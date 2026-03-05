import { addCertificate } from './certificate-store.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = req.body || {};
  const {
    fullName,
    lastName,
    courseEn,
    courseAr,
    issueDate,
    notesEn = '',
    notesAr = '',
    customSerial = ''
  } = body;

  if (!fullName || !lastName || !courseEn || !courseAr || !issueDate) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: fullName, lastName, courseEn, courseAr, issueDate'
    });
  }

  try {
    const certificate = addCertificate({
      fullName,
      lastName,
      courseEn,
      courseAr,
      issueDate,
      notesEn,
      notesAr,
      customSerial
    });

    return res.status(200).json({
      success: true,
      serial: certificate.serial
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message || 'Unable to add certificate' });
  }
}
