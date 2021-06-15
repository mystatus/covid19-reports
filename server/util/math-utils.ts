export function diffEpsilon(a: number, b: number, epsilon = 0.001) {
  const diff = a - b;
  return Math.abs(diff) < epsilon
    ? 0
    : diff;
}
