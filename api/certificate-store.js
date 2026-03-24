const memoryStore = globalThis.__mgiCertificateMemoryStore || {
  certificates: new Map(),
  lookups: new Map(),
  counters: new Map(),
  reservations: new Set()
};

globalThis.__mgiCertificateMemoryStore = memoryStore;

function normalizeSerial(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLastName(value) {
  return normalizeName(value).toLowerCase();
}

function isValidSerialFormat(value) {
  return /^MGI-\d{4}-\d{6}$/i.test(String(value || '').trim());
}

function getKvConfig() {
  const baseUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!baseUrl || !token) {
    if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
      throw new Error(
        'KV is not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).'
      );
    }
    return null;
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

async function kvCommand(command, args = []) {
  const cfg = getKvConfig();
  if (!cfg) return null;

  const path = [command, ...args.map((arg) => encodeURIComponent(String(arg)))].join('/');
  const response = await fetch(`${cfg.baseUrl}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}` }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`KV command failed (${command}): ${detail}`);
  }

  const data = await response.json();
  return data?.result;
}

function serialReservationKey(serial) {
  return `mgi:cert:reserved:${normalizeSerial(serial)}`;
}

function serialDataKey(serial) {
  return `mgi:cert:data:${normalizeSerial(serial)}`;
}

function lookupKey(serial, lastName) {
  return `mgi:cert:lookup:${normalizeSerial(serial)}:${normalizeLastName(lastName)}`;
}

function counterKey(year) {
  return `mgi:cert:counter:${year}`;
}

function isProductionRuntime() {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}

function hasPersistentKv() {
  return Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
}

function ensureStorageModeAllowed() {
  if (!hasPersistentKv() && isProductionRuntime()) {
    throw new Error('KV is not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).');
  }
}

async function reserveSerial(serial) {
  if (hasPersistentKv()) {
    const result = await kvCommand('setnx', [serialReservationKey(serial), '1']);
    return Number(result) === 1;
  }

  const normalized = normalizeSerial(serial);
  if (memoryStore.reservations.has(normalized)) return false;
  memoryStore.reservations.add(normalized);
  return true;
}

async function persistCertificate(certificate) {
  if (hasPersistentKv()) {
    await kvCommand('set', [serialDataKey(certificate.serial), JSON.stringify(certificate)]);
    await kvCommand('set', [lookupKey(certificate.serial, certificate.lastName), certificate.serial]);
    return;
  }

  memoryStore.certificates.set(normalizeSerial(certificate.serial), certificate);
  memoryStore.lookups.set(lookupKey(certificate.serial, certificate.lastName), normalizeSerial(certificate.serial));
}

async function nextCounterValue(year) {
  if (hasPersistentKv()) {
    return Number(await kvCommand('incr', [counterKey(year)]));
  }

  const key = counterKey(year);
  const n = Number(memoryStore.counters.get(key) || 0) + 1;
  memoryStore.counters.set(key, n);
  return n;
}

async function generateSerial(year) {
  const y = String(year || new Date().getFullYear());

  for (let attempts = 0; attempts < 30; attempts += 1) {
    const seq = await nextCounterValue(y);
    const serial = `MGI-${y}-${String(seq).padStart(6, '0')}`;
    const reserved = await reserveSerial(serial);
    if (reserved) return serial;
  }

  throw new Error('Unable to allocate a unique serial. Please retry.');
}

async function addCertificate(data) {
  ensureStorageModeAllowed();
  const year = String(data.issueDate || '').slice(0, 4) || String(new Date().getFullYear());
  const customSerial = data.customSerial ? normalizeSerial(data.customSerial) : '';

  if (customSerial && !isValidSerialFormat(customSerial)) {
    throw new Error('Custom serial must follow MGI-YYYY-XXXXXX format');
  }

  let serial = customSerial;

  if (customSerial) {
    const reserved = await reserveSerial(customSerial);
    if (!reserved) throw new Error('Custom serial already exists');
  } else {
    serial = await generateSerial(year);
  }

  const certificate = {
    serial,
    fullName: normalizeName(data.fullName),
    lastName: normalizeName(data.lastName),
    courseEn: data.courseEn,
    courseAr: data.courseAr,
    issueDate: data.issueDate,
    notesEn: data.notesEn || '',
    notesAr: data.notesAr || '',
    status: 'valid',
    createdAt: new Date().toISOString()
  };

  await persistCertificate(certificate);
  return certificate;
}

async function getCertificateBySerial(serial) {
  ensureStorageModeAllowed();
  const normalizedSerial = normalizeSerial(serial);
  if (!normalizedSerial) return null;

  if (hasPersistentKv()) {
    const raw = await kvCommand('get', [serialDataKey(normalizedSerial)]);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return memoryStore.certificates.get(normalizedSerial) || null;
}

async function getCertificate(serial, lastName) {
  ensureStorageModeAllowed();
  const normalizedSerial = normalizeSerial(serial);
  const normalizedLastName = normalizeLastName(lastName);
  if (!normalizedSerial || !normalizedLastName) return null;

  if (hasPersistentKv()) {
    const lookedUpSerial = await kvCommand('get', [lookupKey(normalizedSerial, normalizedLastName)]);
    if (!lookedUpSerial) return null;
    return getCertificateBySerial(lookedUpSerial);
  }

  const serialFromLookup = memoryStore.lookups.get(lookupKey(normalizedSerial, normalizedLastName));
  if (!serialFromLookup) return null;
  return memoryStore.certificates.get(normalizeSerial(serialFromLookup)) || null;
}

export { addCertificate, getCertificate, getCertificateBySerial, isValidSerialFormat, normalizeName, normalizeLastName, normalizeSerial };
