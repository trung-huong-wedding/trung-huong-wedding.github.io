export function nextIndex(i, n, delta) { return n > 0 ? (((i + delta) % n) + n) % n : 0; }
