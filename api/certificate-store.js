function normalizeSerial(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeLastName(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidSerialFormat(value) {
  return /^MGI-\d{4}-\d{6}$/i.test(String(value || '').trim());
}

function getKvConfig() {
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error('KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN on Vercel.');
  }
  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

async function kvCommand(command, args = []) {
  const { baseUrl, token } = getKvConfig();
  const path = [command, ...args.map((arg) => encodeURIComponent(String(arg)))].join('/');
  const response = await fetch(`${baseUrl}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
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

async function reserveSerial(serial) {
  const result = await kvCommand('setnx', [serialReservationKey(serial), '1']);
  return Number(result) === 1;
}

async function persistCertificate(certificate) {
  await kvCommand('set', [serialDataKey(certificate.serial), JSON.stringify(certificate)]);
  await kvCommand('set', [lookupKey(certificate.serial, certificate.lastName), certificate.serial]);
}

async function generateSerial(year) {
  const y = String(year || new Date().getFullYear());

  for (let attempts = 0; attempts < 30; attempts += 1) {
    const seq = Number(await kvCommand('incr', [counterKey(y)]));
    const serial = `MGI-${y}-${String(seq).padStart(6, '0')}`;
    const reserved = await reserveSerial(serial);
    if (reserved) return serial;
  }

  throw new Error('Unable to allocate a unique serial. Please retry.');
}

async function addCertificate(data) {
  const year = String(data.issueDate || '').slice(0, 4) || String(new Date().getFullYear());
  const customSerial = data.customSerial ? normalizeSerial(data.customSerial) : '';

  if (customSerial && !isValidSerialFormat(customSerial)) {
    throw new Error('Custom serial must follow MGI-YYYY-XXXXXX format');
  }

  let serial = customSerial;

  if (customSerial) {
    const reserved = await reserveSerial(customSerial);
    if (!reserved) {
      throw new Error('Custom serial already exists');
    }
  } else {
    serial = await generateSerial(year);
  }

  const certificate = {
    serial,
    fullName: data.fullName,
    lastName: data.lastName,
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

async function getCertificate(serial, lastName) {
  const normalizedSerial = normalizeSerial(serial);
  const normalizedLastName = normalizeLastName(lastName);
  if (!normalizedSerial || !normalizedLastName) return null;

  const lookedUpSerial = await kvCommand('get', [lookupKey(normalizedSerial, normalizedLastName)]);
  if (!lookedUpSerial) return null;

  const raw = await kvCommand('get', [serialDataKey(lookedUpSerial)]);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export { addCertificate, getCertificate, isValidSerialFormat };
