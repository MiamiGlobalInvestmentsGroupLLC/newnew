const globalStore = globalThis.__mgiCertificateStore || {
  certificates: [],
  yearCounters: {}
};

globalThis.__mgiCertificateStore = globalStore;

function normalizeSerial(value) {
  return String(value || '').trim().toUpperCase();
}

function isValidSerialFormat(value) {
  return /^MGI-\d{4}-\d{6}$/i.test(String(value || '').trim());
}

function hasSerial(serial) {
  const normalized = normalizeSerial(serial);
  return globalStore.certificates.some((item) => normalizeSerial(item.serial) === normalized);
}

function nextSerial(year) {
  const y = String(year || new Date().getFullYear());
  const current = Number(globalStore.yearCounters[y] || 0) + 1;
  globalStore.yearCounters[y] = current;
  return `MGI-${y}-${String(current).padStart(6, '0')}`;
}

function nextAvailableSerial(year) {
  let serial = nextSerial(year);
  while (hasSerial(serial)) {
    serial = nextSerial(year);
  }
  return serial;
}

function setCounterFromCustomSerial(serial) {
  const normalized = normalizeSerial(serial);
  const [, year, suffix] = normalized.split('-');
  const asNumber = Number(suffix);
  if (!Number.isFinite(asNumber)) return;
  const current = Number(globalStore.yearCounters[year] || 0);
  if (asNumber > current) {
    globalStore.yearCounters[year] = asNumber;
  }
}

function addCertificate(data) {
  const year = String(data.issueDate || '').slice(0, 4) || String(new Date().getFullYear());
  const customSerial = data.customSerial ? normalizeSerial(data.customSerial) : '';

  if (customSerial) {
    if (!isValidSerialFormat(customSerial)) {
      throw new Error('Custom serial must follow MGI-YYYY-XXXXXX format');
    }
    if (hasSerial(customSerial)) {
      throw new Error('Custom serial already exists');
    }
  }

  const serial = customSerial || nextAvailableSerial(year);
  if (customSerial) setCounterFromCustomSerial(customSerial);

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

  globalStore.certificates.push(certificate);
  return certificate;
}

function getCertificate(serial, lastName) {
  const normalizedSerial = normalizeSerial(serial);
  const normalizedLastName = String(lastName || '').trim().toLowerCase();
  return (
    globalStore.certificates.find(
      (item) =>
        normalizeSerial(item.serial) === normalizedSerial &&
        String(item.lastName || '').trim().toLowerCase() === normalizedLastName
    ) || null
  );
}

export { addCertificate, getCertificate, isValidSerialFormat };
