/* ============ Himal Fresh Meat – JavaScript ============ */

/* ----------------------------------------------------------
   1) EDIT THIS PART WITH YOUR OWN DETAILS
   ---------------------------------------------------------- */
const CONFIG = {
  businessName: "Himal Fresh Meat",
  // WhatsApp number with country code, NUMBERS ONLY (no +, no spaces).
  // Nepal = 977. Example: 9779841234567
  whatsapp: "+9779705256118",
  phoneDisplay: "+977 9705256118",
  currency: "Rs",

  // Change names, prices (per kg), photos and descriptions here.
  products: [
    {
      id: "goat",
      group: "goat",
      image: "goat",   // photo file name (.jpg / .png / .webp all work)
      emoji: "🐐",   // backup only, shows if the photo is missing
      cls: "goat",
      tag: "Best Seller",
      name: "Goat Meat",
      np: "खसीको मासु",
      desc: "Fresh, tender khasi meat. Perfect for curry, sekuwa, choila and festival feasts.",
      price: 1600
    },
    {
      id: "chicken",
      group: "chicken",
      image: "chicken",   // photo file name (.jpg / .png / .webp all work)
      emoji: "🍗",   // backup only, shows if the photo is missing
      cls: "chicken",
      tag: "Daily Fresh",
      name: "Chicken Meat",
      np: "ब्रोइलर कुखुराको मासु",
      desc: "Clean, fresh broiler chicken. Cut the way you like: curry cut, boneless or whole.",
      price: 420
    },
    {
      id: "kadaknath",
      group: "chicken",
      image: "kadaknath",   // photo file name (.jpg / .png / .webp all work)
      emoji: "🐓",   // backup only, shows if the photo is missing
      cls: "kadaknath",
      tag: "Premium",
      name: "Kadaknath Chicken",
      np: "कडकनाथ कुखुरा",
      desc: "Rare black chicken, rich in protein and iron. Loved for health and a special taste.",
      price: 1500
    },
    {
      id: "local",
      group: "chicken",
      image: ["localchicken", "local"],   // photo file name (.jpg / .png / .webp all work)
      emoji: "🐔",   // backup only, shows if the photo is missing
      cls: "local",
      tag: "Village Style",
      name: "Local Chicken",
      np: "लोकल (देशी) कुखुरा",
      desc: "Free-range desi chicken with strong, natural village flavour. Best for traditional curry.",
      price: 1050
    }
  ]
};

/* ----------------------------------------------------------
   NOTICE BOARD  –  UPDATE / ADD / DELETE NOTICES HERE ANY TIME
   type can be:  "offer"  |  "delivery"  |  "order"  |  "info"
   Change "updated" to today's date when you edit.
   To hide the notice board completely, write:  notices: []
   (The notices below are SAMPLES – replace with your own.)
   ---------------------------------------------------------- */
const NOTICE_BOARD = {
  updated: "22 Oct 2026",
  notices: [
    {
      type: "offer",
      title: "Weekend Special Offer",
      text: "Free home delivery on orders above 5 kg. Order on WhatsApp before Friday evening.",
      date: "22 Oct 2026"
    },
    {
      type: "delivery",
      title: "Today's Delivery Areas",
      text: "Kathmandu, Lalitpur and Bhaktapur. Orders before 10 AM are delivered the same day.",
      date: "22 Oct 2026"
    },
    {
      type: "order",
      title: "Kadaknath Stock Available",
      text: "Fresh Kadaknath chicken available this week. Please book early, quantity is limited.",
      date: "22 Oct 2026"
    }
  ]
};

/* ----------------------------------------------------------
   2) HELPERS
   ---------------------------------------------------------- */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => `${CONFIG.currency} ${Math.round(n).toLocaleString("en-IN")}`;
const waLink = text =>
  `https://wa.me/${CONFIG.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;

// Tries these picture endings and these places automatically
const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"];
function imgList(p) {
  if (!p.image) return [];
  const bases = Array.isArray(p.image) ? p.image : [p.image];
  const out = [];
  bases.forEach(b => {
    if (/\.(jpe?g|png|webp|gif|svg)$/i.test(b)) { out.push(b); return; }
    ["images/", ""].forEach(f => IMG_EXT.forEach(x => out.push(f + b + x)));
  });
  return out;
}

let basket = [];
try { basket = JSON.parse(localStorage.getItem("basket") || "[]"); } catch (e) { basket = []; }
const saveBasket = () => { try { localStorage.setItem("basket", JSON.stringify(basket)); } catch (e) {} };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ----------------------------------------------------------
   3) WHATSAPP LINKS EVERYWHERE
   ---------------------------------------------------------- */
$$("[data-wa]").forEach(a => {
  a.href = waLink(`Namaste ${CONFIG.businessName}! I want to know about your meat and today's price.`);
  a.target = "_blank";
  a.rel = "noopener";
});
const callLink = $("#callLink");
callLink.textContent = CONFIG.phoneDisplay;
callLink.href = "tel:+" + CONFIG.whatsapp;

/* ----------------------------------------------------------
   4) PRODUCTS
   ---------------------------------------------------------- */
const grid = $("#productGrid");
const qtyState = {}; // kg selected per product

function renderProducts() {
  grid.innerHTML = CONFIG.products.map(p => {
    qtyState[p.id] = 1;
    return `
    <article class="card reveal" data-group="${p.group}" data-id="${p.id}">
      <div class="card__img ${p.cls}${imgList(p).length ? " has-img" : ""}">
        <span class="card__tag">${p.tag}</span>
        ${imgList(p).length ? `<img class="card__photo" src="${imgList(p)[0]}" data-c="${imgList(p).join("|")}" alt="${p.name}" />` : ""}
        <span class="card__emoji" aria-hidden="true">${p.emoji}</span>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <div class="card__np">${p.np}</div>
        <p class="card__desc">${p.desc}</p>
        <div class="card__price">${money(p.price)} <small>/ kg</small></div>
        <div class="card__row">
          <div class="qty" aria-label="Quantity in kg">
            <button type="button" data-act="minus" aria-label="Less">−</button>
            <span data-qty>1 kg</span>
            <button type="button" data-act="plus" aria-label="More">+</button>
          </div>
          <button type="button" class="add-btn" data-act="add">Add to Basket</button>
        </div>
      </div>
    </article>`;
  }).join("");
  observeReveal();
}

grid.addEventListener("click", e => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const card = btn.closest(".card");
  const id = card.dataset.id;
  const act = btn.dataset.act;

  if (act === "plus")  qtyState[id] = Math.min(100, qtyState[id] + 0.5);
  if (act === "minus") qtyState[id] = Math.max(0.5, qtyState[id] - 0.5);
  if (act === "plus" || act === "minus") {
    $("[data-qty]", card).textContent = `${qtyState[id]} kg`;
  }
  if (act === "add") {
    addToBasket(id, qtyState[id]);
    const p = CONFIG.products.find(x => x.id === id);
    toast(`${qtyState[id]} kg ${p.name} added ✔`);
  }
});

/* Filters */
$("#filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  $$(".chip").forEach(c => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  const f = chip.dataset.filter;
  $$(".card", grid).forEach(c => c.classList.toggle("hide", f !== "all" && c.dataset.group !== f));
});

/* ----------------------------------------------------------
   5) BASKET
   ---------------------------------------------------------- */
const drawer = $("#drawer"), overlay = $("#overlay");

function addToBasket(id, kg) {
  const found = basket.find(i => i.id === id);
  if (found) found.kg += kg; else basket.push({ id, kg });
  saveBasket();
  renderBasket();
  const b = $("#basketOpen");
  b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
}

function renderBasket() {
  const wrap = $("#basketItems");
  basket = basket.filter(i => CONFIG.products.some(p => p.id === i.id));
  let total = 0;

  if (!basket.length) {
    wrap.innerHTML = `<div class="empty"><span>🛒</span>Your basket is empty.<br/>Add some fresh meat!</div>`;
  } else {
    wrap.innerHTML = basket.map(i => {
      const p = CONFIG.products.find(x => x.id === i.id);
      const line = p.price * i.kg;
      total += line;
      return `
      <div class="item">
        <div class="item__emoji">${imgList(p).length ? `<img class="thumb" src="${imgList(p)[0]}" data-c="${imgList(p).join("|")}" alt="" data-emoji="${p.emoji}" />` : p.emoji}</div>
        <div class="item__info"><b>${p.name}</b><small>${i.kg} kg × ${money(p.price)} = ${money(line)}</small></div>
        <button class="item__remove" data-remove="${i.id}" aria-label="Remove ${p.name}">🗑</button>
      </div>`;
    }).join("");
  }
  $("#basketTotal").textContent = money(total);
  $("#basketCount").textContent = basket.length;
}

function openBasket()  { drawer.classList.add("open"); overlay.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); }
function closeBasket() { drawer.classList.remove("open"); overlay.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); }

$("#basketOpen").addEventListener("click", openBasket);
$("#basketClose").addEventListener("click", closeBasket);
overlay.addEventListener("click", closeBasket);
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeBasket(); closeMenu(); } });

$("#basketItems").addEventListener("click", e => {
  const r = e.target.closest("[data-remove]");
  if (!r) return;
  basket = basket.filter(i => i.id !== r.dataset.remove);
  saveBasket(); renderBasket();
});
$("#clearBasket").addEventListener("click", () => { basket = []; saveBasket(); renderBasket(); });

$("#sendOrder").addEventListener("click", () => {
  if (!basket.length) { toast("Please add some meat first 🙂"); return; }
  const name = $("#oName").value.trim();
  const address = $("#oAddress").value.trim();
  let total = 0;
  const lines = basket.map(i => {
    const p = CONFIG.products.find(x => x.id === i.id);
    total += p.price * i.kg;
    return `• ${p.name}: ${i.kg} kg (${money(p.price * i.kg)})`;
  });
  const msg =
`Namaste ${CONFIG.businessName}! 🙏
I would like to order:

${lines.join("\n")}

Estimated total: ${money(total)}
Name: ${name || "-"}
Address: ${address || "-"}

Please confirm the price and delivery time. Thank you!`;
  window.open(waLink(msg), "_blank", "noopener");
});

/* ----------------------------------------------------------
   6) CONTACT FORM → WHATSAPP
   ---------------------------------------------------------- */
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const n = $("#cName"), m = $("#cMsg"), ph = $("#cPhone");
  let ok = true;
  [n, m].forEach(f => {
    const bad = !f.value.trim();
    f.classList.toggle("error", bad);
    if (bad) ok = false;
  });
  if (!ok) { toast("Please fill your name and message"); return; }
  const msg = `Namaste ${CONFIG.businessName}!\nName: ${n.value.trim()}\nPhone: ${ph.value.trim() || "-"}\n\n${m.value.trim()}`;
  window.open(waLink(msg), "_blank", "noopener");
  e.target.reset();
});

/* ----------------------------------------------------------
   7) MOBILE MENU + HEADER
   ---------------------------------------------------------- */
const burger = $("#burger"), nav = $("#nav");
function closeMenu() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
$$("#nav a").forEach(a => a.addEventListener("click", closeMenu));
window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", window.scrollY > 10), { passive: true });

/* ----------------------------------------------------------
   8) SCROLL ANIMATIONS + COUNTERS
   ---------------------------------------------------------- */
let io;
function observeReveal() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(el => el.classList.add("in")); return; }
  io = io || new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: .12 });
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}

function runCounters() {
  const stats = $(".about__stats");
  if (!stats) return;
  const go = () => $$("[data-count]").forEach(el => {
    const end = +el.dataset.count; let cur = 0;
    const step = Math.max(1, Math.ceil(end / 50));
    const t = setInterval(() => {
      cur = Math.min(end, cur + step);
      el.textContent = cur;
      if (cur >= end) clearInterval(t);
    }, 30);
  });
  if (!("IntersectionObserver" in window)) { go(); return; }
  const o = new IntersectionObserver(([en]) => { if (en.isIntersecting) { go(); o.disconnect(); } }, { threshold: .4 });
  o.observe(stats);
}

/* ----------------------------------------------------------
   8b) NOTICE BOARD RENDER
   ---------------------------------------------------------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const NOTICE_TYPES = { offer: "🎁 Offer", delivery: "🛵 Delivery", order: "📦 Order Update", info: "ℹ️ Info" };

function renderNotices() {
  const sec = $("#notice");
  const list = NOTICE_BOARD.notices || [];
  if (!list.length) { sec.hidden = true; return; }
  $("#noticeUpdated").textContent = "Last updated: " + NOTICE_BOARD.updated;
  $("#noticeGrid").innerHTML = list.map(n => `
    <article class="note-card">
      <span class="note-card__tag">${NOTICE_TYPES[n.type] || NOTICE_TYPES.info}</span>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.text)}</p>
      <div class="note-card__foot">
        <span>${esc(n.date || "")}</span>
        <a href="${waLink("Namaste! I saw your notice: " + n.title)}" target="_blank" rel="noopener">Ask on WhatsApp →</a>
      </div>
    </article>`).join("");
}

/* ----------------------------------------------------------
   9) START
   ---------------------------------------------------------- */
$("#year").textContent = new Date().getFullYear();
renderProducts();
renderNotices();
renderBasket();
observeReveal();
runCounters();

/* ----------------------------------------------------------
   10) HIGHLIGHT CURRENT MENU LINK WHILE SCROLLING
   ---------------------------------------------------------- */
const spyLinks = $$('#nav a[href^="#"]').filter(a => a.getAttribute("href").length > 1);
function spy() {
  const y = window.scrollY + 130;
  let current = null;
  spyLinks.forEach(a => {
    const s = $(a.getAttribute("href"));
    if (s && !s.hidden && s.offsetTop <= y) current = a;
  });
  if (window.scrollY < 60) current = spyLinks[0];
  spyLinks.forEach(a => a.classList.toggle("active", a === current));
}
window.addEventListener("scroll", spy, { passive: true });
spy();

/* ----------------------------------------------------------
   11) PHOTO NOT FOUND? TRY NEXT NAME, THEN SHOW EMOJI
   ---------------------------------------------------------- */
document.addEventListener("error", e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.dataset.c) return;
  const list = img.dataset.c.split("|");
  const next = (+img.dataset.i || 0) + 1;
  if (next < list.length) {
    img.dataset.i = next;
    img.src = list[next];
    return;
  }
  if (img.classList.contains("card__photo")) {
    img.closest(".card__img").classList.remove("has-img");
    img.remove();
  } else {
    img.replaceWith(document.createTextNode(img.dataset.emoji || "🍖"));
  }
}, true);
