setTimeout(() => {
  const l = document.getElementById("loader");
  if (l) {
    l.classList.add("done");
    setTimeout(() => l.remove(), 750);
  }
}, 2200);
let cart = [];
const modal = document.getElementById("cartModal"),
  itemsEl = document.getElementById("cartItems");
const countEl = document.getElementById("cartCount"),
  totalEl = document.getElementById("cartTotal");
const fmt = (n) => n.toLocaleString("uz-UZ") + " so'm";
const renderCart = () => {
  countEl.textContent = String(cart.reduce((s, i) => s + i.qty, 0));
  totalEl.textContent = fmt(cart.reduce((s, i) => s + i.price * i.qty, 0));
  if (!cart.length)
    return (itemsEl.innerHTML =
      '<p class="empty-msg">Savatchangiz hozircha bo\'sh.</p>');
  itemsEl.innerHTML = cart
    .map(
      (i) => `<div class="cart-row">
    <img src="${i.img}" class="cart-thumb" alt="${i.name}">
    <div class="cart-info"><h5>${i.name}</h5><p>${fmt(i.price)}</p>
    <div class="cart-qty"><button onclick="chQ('${i.id}',-1)">-</button>
    <span>${i.qty}</span><button onclick="chQ('${i.id}',1)">+</button></div></div>
    <button onclick="rmI('${i.id}')" class="cart-del">✖️</button></div>`,
    )
    .join("");
};
const addToCart = (id, name, price, img) => {
  const ex = cart.find((i) => i.id === id);
  if (ex) ex.qty++;
  else cart.push({ id, name, price, img, qty: 1 });
  renderCart();
  modal.classList.remove("hidden");
};
window.chQ = (id, d) => {
  const it = cart.find((i) => i.id === id);
  if (it) {
    it.qty += d;
    if (it.qty <= 0) cart = cart.filter((i) => i.id !== id);
    renderCart();
  }
};
window.rmI = (id) => {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
};
document
  .querySelectorAll(".add-to-cart")
  .forEach(
    (b) =>
      (b.onclick = () =>
        addToCart(
          b.dataset.id,
          b.dataset.name,
          Number(b.dataset.price),
          b.dataset.img,
        )),
  );
document.getElementById("openCart").onclick = () =>
  modal.classList.remove("hidden");
document.getElementById("closeCart").onclick = () =>
  modal.classList.add("hidden");
document.getElementById("checkoutBtn").onclick = () => {
  if (!cart.length)
    return (itemsEl.innerHTML =
      '<p class="empty-msg" style="color:#c2410c;font-weight:700">Avval stol tanlang.</p>');
  cart = [];
  renderCart();
  itemsEl.innerHTML =
    '<div class="consult-success">Buyurtmangiz qabul qilindi! Ustaxona menejeri bog\'lanadi.</div>';
};
let mat = { name: "Amerika Yong'og'i", mult: 1, w: 1 },
  sz = { dims: "200 × 100 sm", seats: "6 - 8 kishi", base: 14500000, kg: 68 };
const updateCfg = () => {
  document.getElementById("cfgMatName").textContent = mat.name;
  document.getElementById("cfgSeats").textContent = sz.seats;
  document.getElementById("cfgWeight").textContent =
    `${Math.round(sz.kg * mat.w)} kg`;
  document.getElementById("cfgPrice").textContent = fmt(
    Math.round(sz.base * mat.mult),
  );
  document.getElementById("previewDims").textContent = sz.dims;
};
document.querySelectorAll(".cfg-mat").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".cfg-mat")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      mat = {
        name: b.dataset.name,
        mult: Number(b.dataset.mult),
        w: Number(b.dataset.w),
      };
      document.getElementById("tablePreviewEl").style.background = b.dataset.bg;
      updateCfg();
    }),
);
document.querySelectorAll(".cfg-size").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".cfg-size")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      sz = {
        dims: b.dataset.dims,
        seats: b.dataset.seats,
        base: Number(b.dataset.base),
        kg: Number(b.dataset.kg),
      };
      document.getElementById("tablePreviewEl").style.width = b.dataset.w;
      updateCfg();
    }),
);
document.getElementById("addCustomBtn").onclick = () =>
  addToCart(
    `custom-${mat.name}-${sz.dims}`,
    `Maxsus Stol (${mat.name}, ${sz.dims})`,
    Math.round(sz.base * mat.mult),
    "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80",
  );
document.querySelectorAll(".flt-btn").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".flt-btn")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      document
        .querySelectorAll(".tbl-card")
        .forEach((c) =>
          c.classList.toggle(
            "hidden",
            b.dataset.cat !== "all" && c.dataset.cat !== b.dataset.cat,
          ),
        );
    }),
);
document.getElementById("roomCalcBtn").onclick = () => {
  const l = Number(document.getElementById("roomLen").value) || 4.5,
    w = Number(document.getElementById("roomWid").value) || 3.4;
  const tl = Math.max(120, Math.round((l - 1.8) * 100)),
    tw = Math.max(70, Math.round((w - 1.8) * 100));
  document.getElementById("roomTableRes").textContent = `${tl} × ${tw} sm`;
  document.getElementById("roomSeatsRes").textContent =
    `${tl >= 280 ? "10 - 12" : tl >= 220 ? "8 - 10" : tl >= 180 ? "6 - 8" : "4 - 6"} kishi`;
  document.getElementById("roomAreaRes").textContent =
    `${(l * w).toFixed(1)} m²`;
};
document.querySelectorAll(".faq-row").forEach(
  (r) =>
    (r.onclick = () => {
      const a = r.querySelector(".faq-a"),
        p = r.querySelector(".faq-plus");
      if (a && p) p.textContent = a.classList.toggle("hidden") ? "+" : "-";
    }),
);
const cf = document.getElementById("consultForm");
if (cf)
  cf.onsubmit = (e) => {
    e.preventDefault();
    cf.reset();
    document.getElementById("consultSuccess").classList.remove("hidden");
  };