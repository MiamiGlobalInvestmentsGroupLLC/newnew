import { readFile } from 'node:fs/promises';
import { getCertificate } from './certificate-store.js';

function normalizeSerial(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeLastName(value) {
  return String(value || '').trim().toLowerCase();
}

function extractLastName(record) {
  if (record.lastName) return normalizeLastName(record.lastName);
  const fullName = String(record.fullName || '').trim();
  if (!fullName) return '';
  return normalizeLastName(fullName.split(/\s+/).at(-1));
}

async function findInSeedData(serial, lastName) {
  try {
    const raw = await readFile(new URL('../assets/data/certificates.json', import.meta.url), 'utf8');
    const rows = JSON.parse(raw);
    const wantedSerial = normalizeSerial(serial);
    const wantedLastName = normalizeLastName(lastName);
    return rows.find((row) => normalizeSerial(row.serial) === wantedSerial && extractLastName(row) === wantedLastName) || null;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ found: false, error: 'Method not allowed' });
  }

  const serial = req.query?.serial;
  const lastName = req.query?.lastName;

  if (!serial || !lastName) {
    return res.status(400).json({ found: false, error: 'Missing serial or lastName query parameter' });
  }

  try {
    let certificate = await getCertificate(serial, lastName);

    if (!certificate) {
      certificate = await findInSeedData(serial, lastName);
    }

    if (!certificate) {
      return res.status(200).json({ found: false });
    }

    return res.status(200).json({ found: true, certificate });
  } catch (error) {
    return res.status(500).json({ found: false, error: error.message || 'Server error' });
  }
}
