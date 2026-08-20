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
      heart.style.setProperty("--fill", Math.min(1, count / 10));
    }
  }
  async function cleanupWishlist() {
    const list = await getWishlist();

    const checks = await Promise.all(
      list.map(async (item) => {
        try {
          const res = await fetch(`/products/${item.handle}.js`);
          return res.ok;
        } catch {
          return false;
        }
      }),
    );

    const valid = list.filter((_, i) => checks[i]);

    wishlistCache = valid;

    localStorage.setItem(LS_KEY, JSON.stringify(valid));
    localStorage.setItem(LS_TIME, Date.now());

    updateCount();
  }

  /* ======================
   HEADER
  ====================== */
  function injectHeader() {
    if (document.querySelector(".wl-header")) return;

    const cartSelectors = [
      "a[href*='/cart']",
      "button[name='cart']",
      "[aria-label*='Cart' i]",
      "[aria-label*='cart' i]",
      ".header__icon--cart",
      ".header__icon--cart",
      ".cart-link",
      ".cart-icon",
      ".site-header__cart",
      ".header-cart",
      "[data-cart-toggle]",
      "[data-action='open-cart']",
      "cart-drawer-trigger",
    ];

    let cart = null;

    for (const selector of cartSelectors) {
      cart = document.querySelector(selector);

      if (cart) break;
    }

    if (!cart) return;

    const el = document.createElement("div");
    el.className = "wl-header";

    el.innerHTML = `
    <button class="wl-header-btn" type="button" aria-label="Wishlist">
      <span class="wl-header-heart">

        <svg viewBox="0 0 24 24">

          <defs>
            <linearGradient id="lavaGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#ff3b5c"/>
              <stop offset="50%" stop-color="#ff6a00"/>
              <stop offset="100%" stop-color="#ff0000"/>
            </linearGradient>
          </defs>

          <path
            class="heart-fill"
            d="M12 21s-6.7-4.3-9.3-8C-0.5 9.4 2 4.5 6.3 4.5c2.3 0 3.7 1.4 5.7 3.4 2-2 3.4-3.4 5.7-3.4C22 4.5 24.5 9.4 21.3 13c-2.6 3.7-9.3 8-9.3 8z"
          />

          <path
            class="heart-outline"
            d="M12 21s-6.7-4.3-9.3-8C-0.5 9.4 2 4.5 6.3 4.5c2.3 0 3.7 1.4 5.7 3.4 2-2 3.4-3.4 5.7-3.4C22 4.5 24.5 9.4 21.3 13c-2.6 3.7-9.3 8-9.3 8z"
          />

        </svg>

      </span>

      <span class="wl-count">0</span>
    </button>
  `;

    el.querySelector(".wl-header-btn").onclick = openDrawer;

    // Ставим wishlist непосредственно ПЕРЕД корзиной
    cart.parentNode.insertBefore(el, cart);
  }
  /* ======================
   HEARTS (CATALOG)
  ====================== */
  async function injectHearts() {
    document.querySelectorAll("a[href*='/products/']").forEach((link) => {
      const selectors = [
        ".resource-card",
        ".card-wrapper",
        ".card",
        ".product-card",
        ".product-item",
        ".product-grid-item",
        ".grid__item",
        ".grid-product",
        ".product-block",
        ".collection-product-card",
        ".collection-grid-item",
        ".boost-pfs-filter-product-item",
        ".product",
        ".product-grid__item",
        ".product-loop",
        ".item-product",
        ".product-card-wrapper",
        ".thumbnail",
        "li[class*=product]",
        "[data-product-id]",
        "[data-product-handle]",
      ];

      let card = null;

      for (const selector of selectors) {
        card = link.closest(selector);
        if (card) break;
      }

      if (!card) return;

      if (card.querySelector(".wl-btn")) return;

      const url = new URL(link.href, window.location.origin);
      const match = url.pathname.match(/\/products\/([^/]+)/);

      if (!match) return;

      const handle = match[1];

      /*
       * На product page не создаём catalog-heart
       * для самого открытого товара.
       *
       * Related products при этом продолжают работать.
       */
      const currentHandle = location.pathname
        .split("/products/")[1]
        ?.split("/")[0];

      if (
        location.pathname.includes("/products/") &&
        currentHandle === handle
      ) {
        return;
      }

      // 🔥 СОЗДАЕМ ОВЕРЛЕЙ (НЕ ВНУТРИ <a>)
      const wrapper = document.createElement("div");
      wrapper.className = "wl-overlay";

      const btn = document.createElement("button");

      btn.className = "wl-btn";
      btn.type = "button";
      btn.dataset.handle = handle;
      btn.innerText = "♡";

      btn.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          }

          toggle(handle);
        },
        true,
      );

      wrapper.appendChild(btn);

      // ищем контейнер изображения

      /* =========================
         SAFE WISHLIST POSITION
         ========================= */

      const img = card.querySelector("img");

      if (!img) return;

      card.style.position = "relative";

      wrapper.style.position = "absolute";
      wrapper.style.top = "12px";
      wrapper.style.right = "12px";
      wrapper.style.zIndex = "20";

      card.appendChild(wrapper);
    });

    await sync();
  }
  /* ======================
   PRODUCT PAGE HEART
  ====================== */
  function injectProductHeart() {
    if (!location.pathname.includes("/products/")) return;

    // Уже есть wishlist button
    if (document.querySelector("[data-wishlist-product]")) return;

    const handle = location.pathname.split("/products/")[1]?.split("/")[0];

    if (!handle) return;

    /*
     * Ищем основной блок с кнопками товара.
     */
    const containers = [
      ".product-form__buttons",
      ".product-form-buttons",
      ".product-form",
      ".product__form",
      ".product-information",
      ".product__information",
      ".product-info",
      ".product__info",
      ".product-details",
      ".product__details",
    ];

    let container = null;

    for (const selector of containers) {
      const candidate = document.querySelector(selector);

      if (candidate) {
        container = candidate;
        break;
      }
    }

    if (!container) return;

    /*
     * Создаём обычную кнопку
     * в стиле Add to cart.
     */
    const btn = document.createElement("button");

    btn.className = "wl-product-btn";
    btn.type = "button";

    btn.dataset.handle = handle;
    btn.dataset.wishlistProduct = "true";

    btn.setAttribute("aria-label", "Add to wishlist");

    btn.innerHTML = `
    <span class="wl-product-heart">♡</span>
    <span class="wl-product-text">Add to wishlist</span>
  `;

    btn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }

        toggle(handle);
      },
      true,
    );

    /*
     * Сначала пытаемся поставить Wishlist
     * сразу после Add to cart.
     */
    const addToCart = container.querySelector(
      'button[type="submit"], button[name="add"], [name="add"]',
    );

    if (addToCart) {
      addToCart.insertAdjacentElement("afterend", btn);
    } else {
      container.appendChild(btn);
    }

    updateProductHeart();
  }

  async function updateProductHeart() {
    const buttons = document.querySelectorAll("[data-wishlist-product]");

    if (!buttons.length) return;

    const handle = location.pathname.split("/products/")[1]?.split("/")[0];

    if (!handle) return;

    const list = await getWishlist();

    buttons.forEach((btn) => {
      const heart = btn.querySelector(".wl-product-heart");

      if (!heart) return;

      const active = list.some((item) => item.handle === handle);

      heart.innerText = active ? "❤️‍🔥" : "♡";

      btn.classList.toggle("active", active);
    });
  }

  /* ======================
   TOGGLE
  ====================== */

  function showLavaToast(text) {
    const old = document.querySelector(".wl-toast");

    if (old) old.remove();

    const toast = document.createElement("div");

    toast.className = "wl-toast";

    toast.innerHTML = `
    ❤️‍🔥 ${text}
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 50);

    setTimeout(() => {
      toast.classList.remove("show");

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  async function toggle(handle) {
    const list = await getWishlist();

    const exists = list.some((i) => i.handle === handle);

    /*
     * Оптимистически меняем интерфейс,
     * чтобы кнопка реагировала сразу.
     */
    const optimisticList = exists
      ? list.filter((i) => i.handle !== handle)
      : [...list, { handle }];

    wishlistCache = optimisticList;

    localStorage.setItem(LS_KEY, JSON.stringify(optimisticList));

    localStorage.setItem(LS_TIME, Date.now());

    updateCount();
    sync();

    try {
      const res = await fetch("/apps/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle,
          actionType: "toggle",
        }),
      });

      const text = await res.text();

      console.log("Wishlist response:", res.status, text);

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.log("Wishlist response is not JSON:", text);
      }

      /*
       * Сервер отклонил изменение.
       */
      if (!res.ok || data.upgrade) {
        showLavaToast("Wishlist limit reached ❤️‍🔥");

        /*
         * Возвращаем старое состояние.
         */
        wishlistCache = list;

        localStorage.setItem(LS_KEY, JSON.stringify(list));

        localStorage.setItem(LS_TIME, Date.now());

        updateCount();
        sync();

        return;
      }

      /*
       * КЛЮЧЕВОЕ:
       * после успешного запроса заново получаем
       * реальное состояние Wishlist с сервера.
       */
      const serverList = await getWishlist(true);

      wishlistCache = serverList;

      localStorage.setItem(LS_KEY, JSON.stringify(serverList));

      localStorage.setItem(LS_TIME, Date.now());

      updateCount();
      sync();
    } catch (err) {
      console.error("Wishlist toggle error:", err);

      /*
       * Если запрос вообще не дошёл —
       * возвращаем старое состояние.
       */
      wishlistCache = list;

      localStorage.setItem(LS_KEY, JSON.stringify(list));

      localStorage.setItem(LS_TIME, Date.now());

      updateCount();
      sync();
    }
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
        updateCount();
        sync();
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin: 0 6px;
}

.wl-header-btn {
  position: relative;
  top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
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


/* CARD */

/* PRODUCT PAGE WISHLIST */

/* PRODUCT WISHLIST */
.wl-product-btn {
  display: flex;
  width: 100%;
  box-sizing: border-box;

  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 44px;

  margin: 10px 0;
  padding: 12px 20px;

  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;

  color: inherit;
  font: inherit;
  line-height: 1.2;

  cursor: pointer;

  appearance: none;
  -webkit-appearance: none;

  transition:
    opacity .2s ease,
    transform .15s ease;
}

.wl-product-btn:hover {
  opacity: .7;
}

.wl-product-btn:active {
  transform: scale(.99);
}

.wl-product-heart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 18px;
}

.wl-product-text {
  display: inline-block;
}

.wl-product-btn.active {
  border-color: #ff3b5c;
}

.wl-product-btn.active .wl-product-heart {
  color: #ff3b5c;
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
.wl-overlay{
  position:absolute;
  top:10px;
  right:10px;
  z-index:999;
  pointer-events:none;
}

.wl-overlay {
  pointer-events: none;
}

.wl-overlay .wl-btn {
  pointer-events: auto;
}


.wl-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eee;
  pointer-events: auto;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  .wl-toast {

  position: fixed;

  top: 50%;
  left: 50%;

  transform:
    translate(-50%, -50%)
    scale(.9);

  opacity: 0;

  padding: 22px 30px;

  border-radius: 24px;

  background:
    linear-gradient(
      135deg,
      #ff3b5c,
      #ff6a00,
      #ff0000
    );

  color: white;

  font-size: 18px;
  font-weight: 700;

  text-align: center;

  box-shadow:
    0 0 25px rgba(255,80,50,.45),
    0 0 60px rgba(255,60,60,.35);

  z-index: 999999;

  transition:
    opacity .3s ease,
    transform .3s ease;

  max-width: 360px;
}

.wl-toast.show {

  opacity: 1;

  transform:
    translate(-50%, -50%)
    scale(1);

}
`;

  document.head.appendChild(style);

  /* ======================
   INIT
  ====================== */

  function refreshWishlistUI() {
    injectHeader();
    injectHearts();
    injectProductHeart();
  }

  document.addEventListener("DOMContentLoaded", () => {
    refreshWishlistUI();
    cleanupWishlist();
  });

  document.addEventListener("shopify:section:load", refreshWishlistUI);
  document.addEventListener("shopify:section:select", refreshWishlistUI);
  document.addEventListener("shopify:section:reorder", refreshWishlistUI);
  document.addEventListener("shopify:block:select", refreshWishlistUI);

  let refreshTimer;

  new MutationObserver(() => {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
      refreshWishlistUI();
    }, 120);
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
