(function () {
  let wishlistCache = null;
  let wishlistPromise = null;

  const LS_KEY = "wishlist_cache";
  const LS_TIME = "wishlist_cache_time";
  const TTL = 1000 * 60 * 5; // 5 минут

  window.addEventListener("storage", (e) => {
    if (e.key === LS_KEY) {
      wishlistCache = JSON.parse(e.newValue || "[]");
      updateCount();
      sync();
    }
  });
  /* ======================
   STORAGE
  ====================== */
  async function getWishlist(force = false) {
    // 👉 1. память
    if (!force && wishlistCache) {
      return wishlistCache;
    }

    // 👉 2. localStorage
    const cached = localStorage.getItem(LS_KEY);
    const time = localStorage.getItem(LS_TIME);

    if (!force && cached && time && Date.now() - time < TTL) {
      wishlistCache = JSON.parse(cached);
      return wishlistCache;
    }

    // 👉 3. защита от дублей
    if (!force && wishlistPromise) {
      return wishlistPromise;
    }

    // 👉 4. fetch
    wishlistPromise = fetch("/apps/wishlist")
      .then((r) => r.json())
      .then((data) => {
        wishlistCache = data;

        localStorage.setItem(LS_KEY, JSON.stringify(data));
        localStorage.setItem(LS_TIME, Date.now());

        wishlistPromise = null;
        return data;
      })
      .catch(() => {
        wishlistPromise = null;
        return [];
      });

    return wishlistPromise;
  }
  /* ======================
   COUNT
  ====================== */
  async function updateCount() {
    const list = await getWishlist();
    const count = list.length;

    document.querySelectorAll(".wl-count").forEach((el) => {
      el.innerText = count;
    });

    const heart = document.querySelector(".wl-header-heart");

    if (heart) {
      const fill = Math.min(1, count / 10);
      heart.style.setProperty("--fill", fill);
    }
  }

  window.updateWishlistCount = updateCount;

  /* ======================
   HEADER
  ====================== */
  function injectHeader() {
    if (document.querySelector(".wl-header")) return;

    const target =
      document.querySelector("header .header__icons") ||
      document.querySelector("header");

    if (!target) return;

    const el = document.createElement("div");
    el.className = "wl-header";

    el.innerHTML = `
     <button class="wl-header-btn">
  <span class="wl-header-heart">

    <svg viewBox="0 0 24 24">

      <defs>
        <linearGradient id="lavaGradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#ff3b5c"/>
          <stop offset="50%" stop-color="#ff6a00"/>
          <stop offset="100%" stop-color="#ff0000"/>
        </linearGradient>
      </defs>

      <!-- заливка -->
      <path class="heart-fill"
        d="M12 21s-6.7-4.3-9.3-8C-0.5 9.4 2 4.5 6.3 4.5c2.3 0 3.7 1.4 5.7 3.4 2-2 3.4-3.4 5.7-3.4C22 4.5 24.5 9.4 21.3 13c-2.6 3.7-9.3 8-9.3 8z"
      />

      <!-- контур -->
      <path class="heart-outline"
        d="M12 21s-6.7-4.3-9.3-8C-0.5 9.4 2 4.5 6.3 4.5c2.3 0 3.7 1.4 5.7 3.4 2-2 3.4-3.4 5.7-3.4C22 4.5 24.5 9.4 21.3 13c-2.6 3.7-9.3 8-9.3 8z"
      />

    </svg>

  </span>

  <span class="wl-count">0</span>
</button>
    `;

    el.onclick = openDrawer;
    target.appendChild(el);
  }

  /* ======================
   HEARTS (CATALOG)
  ====================== */
  async function injectHearts() {
    document.querySelectorAll("a[href*='/products/']").forEach((link) => {
      const card = link.closest(".card-wrapper");
      if (!card) return;

      if (card.querySelector(".wl-btn")) return;

      const handle = link.href.split("/products/")[1]?.split("/")[0];
      if (!handle) return;

      // 🔥 СОЗДАЕМ ОВЕРЛЕЙ (НЕ ВНУТРИ <a>)
      const wrapper = document.createElement("div");
      wrapper.className = "wl-overlay";

      const btn = document.createElement("button");
      btn.className = "wl-btn";
      btn.dataset.handle = handle;
      btn.innerText = "♡";

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(handle);
      };

      wrapper.appendChild(btn);

      // 🔥 ВАЖНО: вставляем поверх, а не внутрь ссылки
      card.appendChild(wrapper);
    });

    await sync();
  }
  /* ======================
   PRODUCT PAGE HEART
  ====================== */
  function injectProductHeart() {
    if (!location.pathname.includes("/products/")) return;

    if (document.querySelector(".wl-product-btn")) return;

    const handle = location.pathname.split("/products/")[1]?.split("/")[0];
    if (!handle) return;

    const media = document.querySelector(
      ".product__media, .product-media-container",
    );
    if (!media) return;

    const btn = document.createElement("button");
    btn.className = "wl-product-btn";

    btn.onclick = () => {
      toggle(handle);
      updateProductHeart();
    };

    media.style.position = "relative";
    media.appendChild(btn);

    updateProductHeart();
  }

  async function updateProductHeart() {
    const btn = document.querySelector(".wl-product-btn");
    if (!btn) return;

    const handle = location.pathname.split("/products/")[1]?.split("/")[0];

    const list = await getWishlist(); // ✅

    btn.innerText = list.some((i) => i.handle === handle) ? "❤️‍🔥" : "♡";
  }

  /* ======================
   TOGGLE
  ====================== */
  async function toggle(handle) {
    const list = await getWishlist();

    const exists = list.some((i) => i.handle === handle);

    // 👉 1. optimistic UI
    if (exists) {
      wishlistCache = list.filter((i) => i.handle !== handle);
    } else {
      wishlistCache = [...list, { handle }];
    }

    localStorage.setItem(LS_KEY, JSON.stringify(wishlistCache));
    localStorage.setItem(LS_TIME, Date.now());

    updateCount();
    sync();

    // 👉 2. сервер (НЕ блокируем UI)
    fetch("/apps/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        handle,
        actionType: "toggle",
      }),
    }).then(() => {
      // 👉 3. мягкая синхронизация
      getWishlist(true).then(() => {
        updateCount();
        sync();
      });
    });
  }
  async function sync() {
    const list = await getWishlist(); // ✅

    document.querySelectorAll(".wl-btn").forEach((btn) => {
      const h = btn.dataset.handle;

      if (list.some((i) => i.handle === h)) {
        btn.classList.add("active");
        btn.innerText = "❤️‍🔥";
      } else {
        btn.classList.remove("active");
        btn.innerText = "♡";
      }
    });

    await updateProductHeart();
  }

  /* ======================
   DRAWER
  ====================== */
  function createDrawer() {
    if (document.getElementById("wl-drawer")) return;

    const wrap = document.createElement("div");

    wrap.innerHTML = `
      <div id="wl-overlay"></div>

      <div id="wl-drawer">
        <button id="wl-close">✕</button>
        <h3>❤️‍🔥 My Wishlist</h3>
        <div id="wl-items"></div>
      </div>
    `;

    document.body.appendChild(wrap);

    document.getElementById("wl-close").onclick = closeDrawer;
    document.getElementById("wl-overlay").onclick = closeDrawer;
  }

  function openDrawer() {
    createDrawer();

    document.getElementById("wl-overlay").classList.add("open");
    document.getElementById("wl-drawer").classList.add("open");

    render();
  }

  function closeDrawer() {
    document.getElementById("wl-overlay").classList.remove("open");
    document.getElementById("wl-drawer").classList.remove("open");
  }

  /* ======================
   RENDER
  ====================== */
  async function render() {
    const box = document.getElementById("wl-items");

    const list = await getWishlist(); // ✅ ВОТ ГЛАВНОЕ

    if (!list.length) {
      box.innerHTML = "No items yet";
      return;
    }

    const data = await Promise.all(
      list.map(async (item) => {
        try {
          const res = await fetch(`/products/${item.handle}.js`);
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      }),
    );

    const safeData = data.filter(Boolean);

    box.innerHTML = safeData
      .map((p) => {
        const variant = p.variants.find((v) => v.available) || p.variants[0];

        return `
      <div class="wl-item">
        <img src="${p.featured_image}">
        <div class="wl-info">
          <div>${p.title}</div>

          ${
            variant.available
              ? `<button class="wl-add" data-id="${variant.id}">
                   Add to cart
                 </button>`
              : `<button class="wl-add disabled" disabled>
                   Out of stock
                 </button>`
          }

          <button class="wl-remove" data-h="${p.handle}">
            Remove
          </button>
        </div>
      </div>
    `;
      })
      .join("");
  }

  /* ======================
   EVENTS
====================== */
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".wl-add, .wl-remove");
    if (!btn) return;

    /* ===== REMOVE ===== */
    if (btn.classList.contains("wl-remove")) {
      const h = btn.dataset.h;

      // ⚡ моментально удаляем из UI
      const current = await getWishlist();
      wishlistCache = current.filter((i) => i.handle !== h);

      localStorage.setItem(LS_KEY, JSON.stringify(wishlistCache));
      localStorage.setItem(LS_TIME, Date.now());

      await updateCount();
      await render();
      await sync();

      // сервер в фоне
      fetch("/apps/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: h,
          actionType: "remove",
        }),
      }).then(() => {
        getWishlist(true).then(() => {
          updateCount();
          render();
          sync();
        });
      });

      return;
    }
    /* ===== ADD TO CART ===== */
    if (btn.classList.contains("wl-add")) {
      if (btn.classList.contains("loading")) return;

      const id = Number(btn.dataset.id);
      if (!id) return;

      // ⚡ UI instantly
      btn.classList.add("loading");
      btn.innerText = "Adding...";

      try {
        const res = await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [{ id, quantity: 1 }],
          }),
        });

        const data = await res.json();

        if (!res.ok || data.status) {
          throw new Error("Add failed");
        }

        // ✅ SUCCESS UI
        btn.innerText = "Added ✔";
        btn.disabled = true;

        /* ⚡ мгновенно цифра */
        document
          .querySelectorAll(
            ".cart-count, .cart-count-bubble, .header__icon--cart span",
          )
          .forEach((el) => {
            const n = parseInt(el.innerText) || 0;
            el.innerText = n + 1;
          });

        /* ⚡ открыть/обновить drawer */
        document.dispatchEvent(new CustomEvent("cart:refresh"));

        refreshCartDrawer();
        updateCartCount();
      } catch (err) {
        console.log(err);
        btn.innerText = "Error";
      } finally {
        setTimeout(() => {
          btn.classList.remove("loading");
          if (!btn.disabled) btn.innerText = "Add to cart";
        }, 800);
      }
    }
  });

  /* ======================
   DRAWER REFRESH (главное)
====================== */
  async function refreshCartDrawer() {
    try {
      const res = await fetch("/?sections=cart-drawer");
      const data = await res.json();

      const current = document.querySelector("#CartDrawer, cart-drawer");
      if (!current) return;

      const html = new DOMParser().parseFromString(
        data["cart-drawer"],
        "text/html",
      );

      const updated = html.querySelector("#CartDrawer, cart-drawer");

      if (updated) {
        current.innerHTML = updated.innerHTML;
      }
    } catch (e) {
      console.log("Drawer update error", e);
    }
  }

  /* ======================
   SYNC (опционально)
====================== */
  async function updateCartCount() {
    try {
      const cart = await fetch("/cart.js").then((r) => r.json());
      const count = cart.item_count;

      document
        .querySelectorAll(
          ".cart-count, .cart-count-bubble, .header__icon--cart span",
        )
        .forEach((el) => {
          el.innerText = count;
        });
    } catch (e) {
      console.log("Cart sync error", e);
    }
  } /* ======================
   STYLES
  ====================== */
  const style = document.createElement("style");
  style.innerHTML = `

.wl-header {
  margin-left:12px;
  display:flex;
  align-items:center;
}

/* 🔥 опускаем сердце */
.wl-header-btn {
  position:relative;
  top: 1px; /* ← регулируй: 2–4px идеально */
  background:none;
  border:none;
  cursor:pointer;
}

.wl-btn {
  z-index: 1 !important;
}

header,
.header,
.header-wrapper {
  z-index: 9999 !important;
}

/* контейнер */
.wl-header-heart {
  width:28px;
  height:28px;
  display:inline-block;
}

/* svg */
.wl-header-heart svg {
  width:100%;
  height:100%;
  display:block;
}

/* 🔥 заливка */
.heart-fill {
  fill: url(#lavaGradient);
  transform: scaleY(var(--fill, 0));
  transform-origin: bottom;
  transition: transform 0.35s ease;
}

/* ❤️ контур (ВСЕГДА виден) */
.heart-outline {
  fill: none;
  stroke: #ff3b5c;
  stroke-width: 2;
}

/* hover эффект */
.wl-header-btn:hover .heart-outline {
  stroke: #ff6a00;
}

/* счетчик */
.wl-count {
  position:absolute;
  top:-6px;
  right:-8px;
  background:#ff3b5c;
  color:#fff;
  font-size:10px;
  border-radius:50%;
  padding:2px 6px;
}
.wl-count {
  position:absolute;
  top:-6px;
  right:-8px;
  background:#ff3b5c;
  color:#fff;
  font-size:10px;
  border-radius:50%;
  padding:2px 6px;
}

/* CARD */
.wl-btn {
  position:absolute;
  top:10px;
  right:10px;
  width:34px;
  height:34px;
  border-radius:50%;
  background:#fff;
  border:1px solid #eee;
  cursor:pointer;
}

/* PRODUCT PAGE */
.wl-product-btn {
  position:absolute;
  top:16px;
  right:16px;
  width:42px;
  height:42px;
  border-radius:50%;
  background:#fff;
  border:1px solid #eee;
  font-size:20px;
}

/* DRAWER */
#wl-overlay {
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.5);
  opacity:0;
  pointer-events:none;
  transition:.3s;
  z-index:9998;
}

#wl-overlay.open {
  opacity:1;
  pointer-events:auto;
}

#wl-drawer {
  position:fixed;
  right:-400px;
  top:0;
  width:360px;
  height:100%;
  background:#fff;
  transition:.3s;
  z-index:9999;
  padding:20px;
}

#wl-drawer.open {
  right:0;
}

#wl-close {
  position:absolute;
  top:10px;
  right:10px;
  border:none;
  background:#eee;
  border-radius:50%;
  width:32px;
  height:32px;
}

.wl-item {
  display:flex;
  gap:10px;
  margin-bottom:12px;
}

.wl-item img {
  width:60px;
}
.wl-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none; /* 🔥 пропускаем клики */
}

.wl-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 1px solid #eee;
  pointer-events: auto; /* 🔥 ТОЛЬКО кнопка кликается */
  z-index: 20;
}
  /* 🔥 ОБЩИЕ КНОПКИ */
.wl-add,
.wl-remove {
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  border: none;
  transition: all 0.25s ease;
}

/* 🔥 ADD TO CART */
.wl-add {
  background: linear-gradient(135deg, #ff3b5c, #ff6a00, #ff0000);
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 60, 60, 0.4);
}

/* 🔥 HOVER ЭФФЕКТ */
.wl-add:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(255, 60, 60, 0.7);
}

/* 🔥 ACTIVE CLICK */
.wl-add:active {
  transform: scale(0.95);
}

/* 🔥 ADDED STATE */
.wl-add.added {
  background: linear-gradient(135deg, #ff9500, #ff3b5c);
  box-shadow: 0 0 12px rgba(255, 120, 0, 0.8);
}

/* ❌ REMOVE */
.wl-remove {
  background: transparent;
  border: 1px solid #ddd;
  color: #333;
}

/* ❌ REMOVE HOVER */
.wl-remove:hover {
  border-color: #ff3b5c;
  color: #ff3b5c;
  transform: scale(1.05);
}
  .wl-item .wl-add,
.wl-item .wl-remove {
  margin-top: 10px;
}
`;

  document.head.appendChild(style);

  /* ======================
   INIT
  ====================== */
  document.addEventListener("DOMContentLoaded", () => {
    injectHeader();
    injectHearts();
    injectProductHeart();
    updateCount();
  });

  document.addEventListener("shopify:section:load", () => {
    injectHearts();
    injectProductHeart();
  });
})();
