const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeGuestName(raw, max = 60) {
  if (raw == null) return "";
  return String(raw).replace(CTRL, "").trim().slice(0, max);
}

export function validateEntry({ name, message }, { maxName, maxMessage }) {
  const n = String(name ?? "").replace(CTRL, "").trim();
  const m = String(message ?? "").replace(CTRL, "").trim();
  const errors = {};
  if (!n) errors.name = "Bạn vui lòng nhập tên.";
  else if (n.length > maxName) errors.name = `Tên tối đa ${maxName} ký tự.`;
  if (!m) errors.message = "Bạn vui lòng nhập lời chúc.";
  else if (m.length > maxMessage) errors.message = `Lời chúc tối đa ${maxMessage} ký tự.`;
  return { ok: Object.keys(errors).length === 0, errors, value: { name: n, message: m } };
}

export function cooldownRemaining(lastMs, nowMs, cooldownSec) {
  if (!Number.isFinite(lastMs)) return 0;
  return Math.max(0, Math.ceil(cooldownSec - (nowMs - lastMs) / 1000));
}

export function isFirebaseConfigured(cfg) { return !!(cfg && cfg.apiKey && cfg.projectId); }
