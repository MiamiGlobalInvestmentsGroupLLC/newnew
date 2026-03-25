import path from 'node:path';
import { readFile } from 'node:fs/promises';

function normalizeName(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLastName(value) {
  return normalizeName(value).toLowerCase();
}

function normalizeSerial(value) {
  return String(value || '').trim().toUpperCase();
}

function extractLastName(record) {
  if (record.lastName) return normalizeLastName(record.lastName);
  const fullName = normalizeName(record.fullName || '');
  if (!fullName) return '';
  return normalizeLastName(fullName.split(/\s+/).at(-1));
}

async function loadCertificates() {
  const filePath = path.join(process.cwd(), 'assets', 'data', 'certificates.json');
  try {
    const raw = await readFile(filePath, 'utf8');
    const rows = JSON.parse(raw);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error('[get-certificate] failed to load JSON file:', error?.message || error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ found: false, error: 'Method not allowed' });
  }

  const serialRaw = req.query?.serial;
  const enteredRaw = req.query?.lastName || req.query?.name;

  const serial = normalizeSerial(serialRaw);
  const enteredName = normalizeName(enteredRaw);

  console.log('[get-certificate] incoming serial:', serial);
  console.log('[get-certificate] incoming name/lastName:', enteredName);

  if (!serial || !enteredName) {
    console.log('[get-certificate] missing required query params');
    return res.status(400).json({ found: false, error: 'Missing serial or lastName/name query parameter' });
  }

  const certificates = await loadCertificates();
  if (!certificates) {
    return res.status(500).json({ found: false, error: 'Failed to load certificate records' });
  }

  console.log('[get-certificate] loaded certificate count:', certificates.length);

  const serialMatches = certificates.filter((record) => normalizeSerial(record.serial) === serial);
  console.log('[get-certificate] serial matches count:', serialMatches.length);

  let matched = null;
  for (const record of serialMatches) {
    const recordLastName = extractLastName(record);
    const recordFullName = normalizeName(record.fullName || '');

    const lastNameMatched = recordLastName === normalizeLastName(enteredName);
    const fullNameMatched = recordFullName === enteredName;

    console.log('[get-certificate] evaluating record:', {
      serial: record.serial,
      recordLastName,
      recordFullName,
      lastNameMatched,
      fullNameMatched
    });

    // Primary: serial + lastName exact match
    if (lastNameMatched) {
      matched = record;
      break;
    }

    // Fallback: serial + fullName exact match
    if (fullNameMatched) {
      matched = record;
      break;
    }
  }

  console.log('[get-certificate] final result:', matched ? 'found' : 'not found');

  if (!matched) {
    return res.status(200).json({ found: false });
  }

  return res.status(200).json({ found: true, certificate: matched });
}
