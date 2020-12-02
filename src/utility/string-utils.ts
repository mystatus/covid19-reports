export function getLineCount(str: string) {
  return (str.match(/\n/g) ?? '').length + 1;
}
