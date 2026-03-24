import { readFile } from 'node:fs/promises';
import { getCertificate, getCertificateBySerial, normalizeName, normalizeLastName, normalizeSerial } from './certificate-store.js';

function extractRecordLastName(record) {
  if (record.lastName) return normalizeLastName(record.lastName);
  const fullName = normalizeName(record.fullName || '');
  if (!fullName) return '';
  return normalizeLastName(fullName.split(/\s+/).at(-1));
}

function namesMatch(record, enteredName) {
  const wanted = normalizeName(enteredName);
  if (!wanted) return false;

  const recordLastName = extractRecordLastName(record);
  if (recordLastName && recordLastName === normalizeLastName(wanted)) return true;

  const recordFullName = normalizeName(record.fullName || '');
  return Boolean(recordFullName && recordFullName === wanted);
}

async function findInSeedData(serial, enteredName) {
  try {
    const raw = await readFile(new URL('../assets/data/certificates.json', import.meta.url), 'utf8');
    const rows = JSON.parse(raw);
    const wantedSerial = normalizeSerial(serial);
    return rows.find((row) => normalizeSerial(row.serial) === wantedSerial && namesMatch(row, enteredName)) || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ found: false, error: 'Method not allowed' });
  }

  const serial = req.query?.serial;
  const enteredName = req.query?.lastName || req.query?.name;

  if (!serial || !enteredName) {
    return res.status(400).json({ found: false, error: 'Missing serial or lastName/name query parameter' });
  }

  try {
    let certificate = await getCertificate(serial, enteredName);

    if (!certificate) {
      const bySerial = await getCertificateBySerial(serial);
      if (bySerial && namesMatch(bySerial, enteredName)) {
        certificate = bySerial;
      }
    }

    if (!certificate) {
      certificate = await findInSeedData(serial, enteredName);
    }

    if (!certificate) {
      return res.status(200).json({ found: false });
    }

    return res.status(200).json({ found: true, certificate });
  } catch (error) {
    return res.status(500).json({ found: false, error: error.message || 'Server error' });
  }
}
