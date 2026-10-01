// Form xác nhận tham dự: chỉ để điền. Gửi xong hiện lời cảm ơn, không lưu và không gửi đi đâu.
export function initRsvp() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    if (!name) { form.elements.name.focus(); form.elements.name.setAttribute("aria-invalid", "true"); return; }
    form.elements.name.removeAttribute("aria-invalid");
    form.querySelectorAll("input,textarea,button").forEach((el) => { el.disabled = true; });
    document.getElementById("rsvpThanks").hidden = false;
  });
}
