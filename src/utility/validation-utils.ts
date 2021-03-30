// from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validatePhone(phone: string) {
  const numeric = phone.replace(/\D/g, '');
  return numeric.length === 10;
}
