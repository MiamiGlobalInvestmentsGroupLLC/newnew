const globalStore = globalThis.__mgiCertificateStore || {
  certificates: [],
  yearCounters: {}
};

globalThis.__mgiCertificateStore = globalStore;

function nextSerial(year) {
  const y = String(year || new Date().getFullYear());
  const current = Number(globalStore.yearCounters[y] || 0) + 1;
  globalStore.yearCounters[y] = current;
  return `MGI-${y}-${String(current).padStart(6, '0')}`;
}

function addCertificate(data) {
  const year = String(data.issueDate || '').slice(0, 4) || new Date().getFullYear();
  const serial = nextSerial(year);
  const certificate = {
    serial,
    fullName: data.fullName,
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

function getCertificate(serial) {
  return globalStore.certificates.find((item) => item.serial.toUpperCase() === String(serial || '').toUpperCase()) || null;
}

export { addCertificate, getCertificate };
