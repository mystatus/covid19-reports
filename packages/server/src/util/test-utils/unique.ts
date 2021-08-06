let intCount = 0;
export function uniqueInt() {
  intCount += 1;
  return intCount;
}

let stringCount = 0;
export function uniqueString() {
  stringCount += 1;
  return `${stringCount}`;
}

let dateCount = 0;
export function uniqueDate() {
  dateCount += 1;
  return new Date(dateCount);
}

let edipiCount = 0;
export function uniqueEdipi() {
  edipiCount += 1;
  return `${edipiCount}`.padStart(10, '0');
}

export function resetUniqueEdipiGenerator() {
  edipiCount = 0;
}

let emailCount = 0;
export function uniqueEmail() {
  emailCount += 1;
  return `${emailCount}@setest.com`;
}

let phoneCount = 0;
export function uniquePhone() {
  phoneCount += 1;
  const last7 = phoneCount.toString().slice(-7).padStart(7, '0');
  return `(555) ${last7.slice(0, 3)}-${last7.slice(3)}`;
}
