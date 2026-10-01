export class TimeoutError extends Error {}

// Promise.race với hạn chót; luôn dọn timer để không treo.
export function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new TimeoutError("timeout")), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
