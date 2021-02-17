const intGen = (function* (): Generator<number, number, void> {
  let nextInt = 0;
  while (true) {
    yield nextInt;
    nextInt += 1;
  }
}());

export function uniqueInt() {
  return intGen.next().value;
}

export function uniqueString() {
  return `${uniqueInt()}`;
}

export function uniqueDate() {
  return new Date(uniqueInt());
}

export function uniqueEdipi() {
  return `${uniqueInt()}`.padStart(10, '0');
}

export function uniqueEmail() {
  return `${uniqueString()}@statusenginetest.com`;
}

export function uniquePhone() {
  return `${uniqueInt()}`.padStart(10, '0');
}
