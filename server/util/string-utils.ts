export function formatPhoneNumber(phone: string) {
  const phoneDigits = phone.replace(/\D/g, '');

  if (phoneDigits.length === 10) {
    return `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
  }

  return phone;
}
