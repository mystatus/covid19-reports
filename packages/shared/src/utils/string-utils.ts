import { formatNumber } from 'libphonenumber-js';

export function formatPhoneNumber(phone: string) {
  return formatNumber(phone, 'US', 'NATIONAL');
}
