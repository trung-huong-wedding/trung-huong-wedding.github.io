import { validateEntry, cooldownRemaining, isFirebaseConfigured, formatGuestTime } from "./lib/text.js";
import { withTimeout, TimeoutError } from "./lib/async.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const LS_KEY = "gb:lastPost";

// Sổ lưu bút lưu bằng Firebase Firestore. Chưa cấu hình / lỗi mạng thì hiện lời chúc mẫu trong config.
export async function initGuestbook(C) {
  const g = C.guestbook;
  const list = document.getElementById("gbList"), form = document.getElementById("gbForm"), msg = document.getElementById("gbMsg");
  const more = document.getElementById("gbMore"), count = document.getElementById("gbCount"), submit = document.getElementById("gbSubmit");
  if (!list || !form) return;

  const fmt = formatGuestTime; // "hh:mm:ss dd/mm/yyyy" theo giờ Việt Nam
  const draw = (items) => {
    list.replaceChildren(...items.map((it) => {
      const li = document.createElement("li"); li.className = "gb-item";
      const n = document.createElement("b"); n.textContent = it.name;
      const d = document.createElement("time"); d.textContent = fmt(it.createdAtMs);
      const p = document.createElement("p"); p.textContent = it.message; // textContent: an toàn trước XSS
      li.append(n, d, p); return li;
    }));
  };
  const say = (t, bad = false) => { msg.textContent = t; msg.classList.toggle("is-bad", bad); };

  form.elements.message.addEventListener("input", () => { count.textContent = `${form.elements.message.value.length}/${g.maxMessage}`; });

  let online = isFirebaseConfigured(C.firebase), api = null, db = null, limitN = g.pageSize, unsub = null;
  draw(g.samples); // hiện ngay lời chúc mẫu trong lúc chờ Firebase
  if (online) {
    try {
      // mạng chặn/chậm: bỏ cuộc sau 8s
      const [{ initializeApp }, fs] = await withTimeout(Promise.all([import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-firestore.js`)]), 8000);
      db = fs.getFirestore(initializeApp(C.firebase)); api = fs;
    } catch { online = false; }
  }

  const subscribe = () => {
    if (!online) { draw(g.samples); more.hidden = true; return; }
    unsub?.();
    const q = api.query(api.collection(db, "guestbook"), api.orderBy("createdAt", "desc"), api.limit(limitN + 1));
    unsub = api.onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => { const v = d.data(); return { name: String(v.name ?? ""), message: String(v.message ?? ""), createdAtMs: v.createdAt?.toMillis?.() ?? Date.now() }; });
      more.hidden = docs.length <= limitN;
      draw(docs.length ? docs.slice(0, limitN) : g.samples);
    }, () => { online = false; draw(g.samples); more.hidden = true; say("Chưa kết nối được sổ lưu bút, bạn thử lại sau nhé.", true); });
  };
  more.addEventListener("click", () => { limitN += g.pageSize; subscribe(); });
  subscribe();

  let sending = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    let last = NaN; try { last = Number(localStorage.getItem(LS_KEY)); } catch {} // có thể throw ở chế độ riêng tư
    const wait = cooldownRemaining(last, Date.now(), g.cooldownSec);
    if (wait > 0) return say(`Bạn vừa gửi xong, vui lòng chờ ${wait} giây nữa nhé.`, true);
    const v = validateEntry({ name: form.elements.name.value, message: form.elements.message.value }, { maxName: g.maxName, maxMessage: g.maxMessage });
    if (!v.ok) return say(v.errors.name || v.errors.message, true);
    if (!online || !api) return say("Sổ lưu bút chưa sẵn sàng, bạn thử lại sau nhé.", true);
    sending = true; submit.disabled = true; say("Đang gửi…");
    try {
      let pending = false;
      try {
        await withTimeout(api.addDoc(api.collection(db, "guestbook"), { name: v.value.name, message: v.value.message, createdAt: api.serverTimestamp() }), 10000);
      } catch (err) {
        if (!(err instanceof TimeoutError)) throw err;
        pending = true; // mạng chập chờn: Firestore giữ lệnh ghi và gửi khi có mạng
      }
      try { localStorage.setItem(LS_KEY, String(Date.now())); } catch {}
      form.reset(); count.textContent = `0/${g.maxMessage}`;
      say(pending ? "Lời chúc đang được gửi; nếu chưa thấy hiện, bạn kiểm tra mạng và thử lại sau nhé." : "Cảm ơn lời chúc của bạn ♥");
    } catch { say("Gửi chưa được, bạn thử lại sau nhé.", true); }
    finally { sending = false; submit.disabled = false; }
  });
}
