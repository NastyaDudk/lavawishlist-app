(function () {
  let wishlistCache = null;
  let wishlistPromise = null;

  const LS_KEY = "wishlist_cache";
  const LS_TIME = "wishlist_cache_time";
  const TTL = 1000 * 60 * 5; // 5 минут

  /* =========================================================
     STORAGE
  ========================================================= */

  window.addEventListener("storage", (e) => {
    if (e.key !== LS_KEY) return;

    try {
      wishlistCache = JSON.parse(e.newValue || "[]");
    } catch {
      wishlistCache = [];
    }

    updateCount();
    sync();
  });

  async function getWishlist(force = false) {
    /* 1. MEMORY */
    if (!force && wishlistCache) {
      return wishlistCache;
    }

    /* 2. LOCAL STORAGE */
    const cached = localStorage.getItem(LS_KEY);
    const time = localStorage.getItem(LS_TIME);

    if (!force && cached && time && Date.now() - Number(time) < TTL) {
      try {
        wishlistCache = JSON.parse(cached);
        return wishlistCache;
      } catch {
        wishlistCache = null;
      }
    }

    /* 3. PREVENT DUPLICATE REQUESTS */
    if (!force && wishlistPromise) {
      return wishlistPromise;
    }

    /* 4. SERVER */
    wishlistPromise = fetch("/apps/wishlist")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Wishlist GET failed: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        wishlistCache = Array.isArray(data) ? data : [];

        localStorage.setItem(LS_KEY, JSON.stringify(wishlistCache));

        localStorage.setItem(LS_TIME, Date.now());

        wishlistPromise = null;

        return wishlistCache;
      })
      .catch((error) => {
        console.log("Wishlist GET error:", error);

        wishlistPromise = null;

        return wishlistCache || [];
      });

    return wishlistPromise;
  }

  /* =========================================================
     COUNT
  ========================================================= */

  async function updateCount() {
    const list = await getWishlist();
    const count = list.length;

    document.querySelectorAll(".wl-count").forEach((el) => {
      el.innerText = count;
    });

    /*
     * Обновляем fill только у header-heart.
     * Никаких .wl-header здесь нет.
     */
    document.querySelectorAll(".wl-header-heart").forEach((heart) => {
      heart.style.setProperty("--fill", Math.min(1, count / 10));
    });
  }

  /* =========================================================
     CLEANUP
  ========================================================= */

  async function cleanupWishlist() {
    const list = await getWishlist();

    if (!list.length) return;

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

    const valid = list.filter((_, index) => checks[index]);

    wishlistCache = valid;

    localStorage.setItem(LS_KEY, JSON.stringify(valid));

    localStorage.setItem(LS_TIME, Date.now());

    updateCount();
    sync();
  }

  /* =========================================================
     HEADER

     ВАЖНО:
     НЕТ .wl-header.

     Wishlist button физически вставляется
     в тот же DOM-контейнер, где Search / Cart.
  ========================================================= */

  function createHeaderWishlistButton() {
    const button = document.createElement("button");

    button.className = "wl-header-btn";
    button.type = "button";
    button.setAttribute("aria-label", "Wishlist");

    button.innerHTML = `
      <span class="wl-header-heart">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="wishlistLavaGradient"
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              <stop
                offset="0%"
                stop-color="#ff3b5c"
              />
              <stop
                offset="50%"
                stop-color="#ff6a00"
              />
              <stop
                offset="100%"
                stop-color="#ff0000"
              />
            </linearGradient>
          </defs>

          <path
            class="heart-fill"
            d="M12 21s-6.7-4.3-9.3-8C-.5 9.4 2 4.5 6.3 4.5c2.3 0 3.7 1.4 5.7 3.4 2-2 3.4-3.4 5.7-3.4C22 4.5 24.5 9.4 21.3 13c-2.6 3.7-9.3 8-9.3 8z"
          />

          <path
            class="heart-outline"
            d="M12 21s-6.7-4.3-9.3-8C-.5 9.4 2 4.5 6.3 4.5c2.3 0 3.7 1.4 5.7 3.4 2-2 3.4-3.4 5.7-3.4C22 4.5 24.5 9.4 21.3 13c-2.6 3.7-9.3 8-9.3 8z"
          />
        </svg>
      </span>

      <span class="wl-count">0</span>
    `;

    /*
     * ВАЖНО:
     * никакого openDrawer().
     *
     * Header heart просто является wishlist button.
     */
    button.addEventListener("click", () => {
      /*
       * Пока header wishlist не открывает drawer.
       * Сам wishlist работает через toggle.
       *
       * Здесь намеренно ничего нет.
       */
    });

    return button;
  }

  function injectHeader() {
    // Удаляем старую обёртку Wishlist
    document.querySelectorAll(".wl-header").forEach((el) => {
      el.remove();
    });

    // Нативный контейнер темы — НЕ удаляем
    const container = document.querySelector(".header__columns.spacing--style");

    if (!container) return;

    // Ищем корзину именно внутри этого контейнера
    const cart = container.querySelector(
      'a[href*="/cart"], button[name="cart"], [aria-label*="cart" i], .header__icon--cart, .cart-link, .cart-icon',
    );

    if (!cart) return;

    // Если уже есть наша иконка — не создаём новую
    let button = container.querySelector(".wl-header-btn");

    if (!button) {
      button = createHeaderWishlistButton();
    }

    // Ставим Wishlist непосредственно перед корзиной
    if (button.nextElementSibling !== cart) {
      container.insertBefore(button, cart);
    }
  }

  /* =========================================================
     CATALOG HEARTS

     button.wl-btn
  ========================================================= */

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

      /*
       * Не создаём второй heart.
       */
      if (card.querySelector(".wl-btn[data-wishlist-catalog]")) {
        return;
      }

      const handle = link.href.split("/products/")[1]?.split("/")[0];

      if (!handle) return;

      const btn = document.createElement("button");

      btn.className = "wl-btn";
      btn.type = "button";

      btn.dataset.handle = handle;
      btn.dataset.wishlistCatalog = "true";

      btn.setAttribute("aria-label", "Add to wishlist");

      btn.innerHTML = `
          <span class="wl-heart">♡</span>
        `;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }

        toggle(handle);
      });

      /*
       * Находим изображение.
       */
      const media =
        card.querySelector(".product-media") ||
        card.querySelector(".product-media-container") ||
        card.querySelector(".product__media") ||
        card.querySelector(".card__media") ||
        card.querySelector(".card-media") ||
        card.querySelector(".media") ||
        card.querySelector(".resource-card__media") ||
        card.querySelector(".resource-card__image");

      /*
       * Кнопка реально добавляется
       * в карточку.
       */
      const target = media || card.querySelector("img")?.parentElement || card;

      if (!target) return;

      const computed = getComputedStyle(target);

      if (computed.position === "static") {
        target.style.position = "relative";
      }

      target.appendChild(btn);
    });

    await sync();
  }

  /* =========================================================
     PRODUCT PAGE HEART

     ВАЖНО:
     Здесь НЕ fixed.
     Здесь НЕ body.

     button.wl-btn физически находится
     внутри product information group.
  ========================================================= */

  function findProductWishlistGroup() {
    /*
     * Точная структура из твоего DevTools.
     */
    const exactGroups = document.querySelectorAll(
      ".group-block-content.layout-panel-flex.layout-panel-flex--column",
    );

    /*
     * Сначала ищем группу, которая находится
     * внутри product information и содержит
     * название / цену / product form.
     */

    for (const group of exactGroups) {
      if (
        group.querySelector("h1, .product__title, .product-title") &&
        group.closest("main")
      ) {
        return group;
      }
    }

    /*
     * Второй вариант:
     * группа, содержащая цену.
     */

    for (const group of exactGroups) {
      if (
        group.querySelector(".price, [class*='price'], [data-price]") &&
        group.closest("main")
      ) {
        return group;
      }
    }

    /*
     * Fallback для других тем.
     */

    const fallbacks = [
      ".product-information",
      ".product__information",
      ".product-info",
      ".product__info",
      ".product-details",
      ".product__details",
      ".product-form",
      ".product__form",
    ];

    for (const selector of fallbacks) {
      const element = document.querySelector(selector);

      if (element) {
        return element;
      }
    }

    return null;
  }

  function injectProductHeart() {
    if (!location.pathname.includes("/products/")) {
      return;
    }

    if (document.querySelector(".wl-btn[data-wishlist-product]")) {
      return;
    }

    const handle = location.pathname.split("/products/")[1]?.split("/")[0];

    if (!handle) return;

    const group = findProductWishlistGroup();

    if (!group) return;

    const btn = document.createElement("button");

    btn.className = "wl-btn";

    btn.type = "button";

    btn.dataset.handle = handle;
    btn.dataset.wishlistProduct = "true";

    btn.setAttribute("aria-label", "Add to wishlist");

    btn.innerHTML = `
      <span class="wl-heart">♡</span>
    `;

    /*
     * Не даём теме перехватывать click.
     */
    const stopEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
    };

    btn.addEventListener("pointerdown", stopEvent, true);

    btn.addEventListener("mousedown", stopEvent, true);

    btn.addEventListener("touchstart", stopEvent, true);

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
     * НИКАКОГО appendChild в body.
     *
     * Кнопка физически находится
     * внутри нужного group-block.
     */
    group.appendChild(btn);

    updateProductHeart();
  }

  async function updateProductHeart() {
    const buttons = document.querySelectorAll(".wl-btn[data-wishlist-product]");

    if (!buttons.length) return;

    const list = await getWishlist();

    buttons.forEach((btn) => {
      const handle = btn.dataset.handle;

      if (!handle) return;

      const active = list.some((item) => item.handle === handle);

      const heart = btn.querySelector(".wl-heart");

      if (heart) {
        heart.innerText = active ? "❤️‍🔥" : "♡";
      }

      btn.classList.toggle("active", active);
    });
  }

  /* =========================================================
     TOGGLE
  ========================================================= */

  function showLavaToast(text) {
    const old = document.querySelector(".wl-toast");

    if (old) {
      old.remove();
    }

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
    if (!handle) return;

    const list = await getWishlist();

    const exists = list.some((item) => item.handle === handle);

    /*
     * OPTIMISTIC UI
     */

    if (exists) {
      wishlistCache = list.filter((item) => item.handle !== handle);
    } else {
      wishlistCache = [...list, { handle }];
    }

    localStorage.setItem(LS_KEY, JSON.stringify(wishlistCache));

    localStorage.setItem(LS_TIME, Date.now());

    /*
     * Сразу обновляем все hearts.
     */
    updateCount();
    sync();

    /*
     * SERVER
     */
    fetch("/apps/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        handle,
        actionType: "toggle",
      }),
    })
      .then(async (res) => {
        const text = await res.text();

        console.log("Wishlist status:", res.status);

        console.log("Wishlist response:", text);

        let data = {};

        try {
          data = JSON.parse(text);
        } catch (error) {
          console.log("Wishlist response is not JSON:", text);

          throw error;
        }

        /*
         * LIMIT REACHED
         */
        if (!res.ok || data.upgrade) {
          showLavaToast("Wishlist limit reached ❤️‍🔥");

          /*
           * Откатываем optimistic update.
           */
          wishlistCache = list;

          localStorage.setItem(LS_KEY, JSON.stringify(list));

          localStorage.setItem(LS_TIME, Date.now());

          updateCount();
          sync();

          return;
        }

        /*
         * Получаем актуальное состояние
         * с сервера.
         */
        await getWishlist(true);

        updateCount();
        sync();
      })
      .catch((error) => {
        console.log("Wishlist toggle error:", error);

        /*
         * Откатываем при ошибке запроса.
         */
        wishlistCache = list;

        localStorage.setItem(LS_KEY, JSON.stringify(list));

        localStorage.setItem(LS_TIME, Date.now());

        updateCount();
        sync();
      });
  }

  /* =========================================================
     SYNC
  ========================================================= */

  async function sync() {
    const list = await getWishlist();

    /*
     * CATALOG + PRODUCT HEARTS
     */
    document.querySelectorAll(".wl-btn").forEach((btn) => {
      const handle = btn.dataset.handle;

      if (!handle) return;

      const active = list.some((item) => item.handle === handle);

      const heart = btn.querySelector(".wl-heart");

      if (heart) {
        heart.innerText = active ? "❤️‍🔥" : "♡";
      }

      btn.classList.toggle("active", active);
    });

    /*
     * HEADER
     */
    updateCount();
  }

  /* =========================================================
     STYLES
  ========================================================= */

  const style = document.createElement("style");

  style.innerHTML = `

    /* =====================================================
       HEADER WISHLIST

       НЕТ .wl-header.
       Button находится непосредственно
       внутри header container.
    ===================================================== */

    .wl-header-btn {
      position: relative !important;

      width: 40px !important;
      height: 40px !important;

      flex: 0 0 40px !important;

      display: inline-flex !important;

      align-items: center !important;
      justify-content: center !important;

      padding: 0 !important;
      margin: 0 4px !important;

      background: transparent !important;

      border: 0 !important;

      cursor: pointer;

      appearance: none;

      -webkit-appearance: none;
    }

    .wl-header-heart {
      width: 28px;
      height: 28px;

      display: block;

      position: relative;
    }

    .wl-header-heart svg {
      width: 100%;
      height: 100%;

      display: block;
    }

    .wl-header-heart .heart-fill {
      fill: url(#wishlistLavaGradient);

      transform:
        scaleY(var(--fill, 0));

      transform-origin: bottom;

      transition:
        transform .35s ease;
    }

    .wl-header-heart .heart-outline {
      fill: none;

      stroke: #ff3b5c;

      stroke-width: 2;
    }

    .wl-header-btn:hover
    .heart-outline {
      stroke: #ff6a00;
    }

    .wl-count {
      position: absolute;

      top: 0;
      right: 0;

      min-width: 14px;
      height: 14px;

      display: flex;

      align-items: center;
      justify-content: center;

      background: #ff3b5c;

      color: #fff;

      font-size: 9px;
      line-height: 1;

      border-radius: 50%;

      padding: 0 3px;

      box-sizing: border-box;
    }


    /* =====================================================
       CATALOG + PRODUCT BUTTON

       И catalog heart, и product heart —
       один класс: button.wl-btn
    ===================================================== */

    .wl-btn {
      width: 36px;
      height: 36px;

      display: flex;

      align-items: center;
      justify-content: center;

      box-sizing: border-box;

      padding: 0;

      margin: 0;

      border-radius: 50%;

      border: 1px solid #eee;

      background: #fff;

      color: #000;

      font-size: 22px;
      line-height: 1;

      cursor: pointer;

      appearance: none;

      -webkit-appearance: none;

      transition:
        transform .18s ease,
        background .18s ease,
        border-color .18s ease;
    }

    .wl-btn:hover {
      transform: scale(1.06);
    }

    .wl-btn:active {
      transform: scale(.94);
    }

    .wl-btn.active {
      border-color: #ff3b5c;
    }

    .wl-heart {
      display: flex;

      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      line-height: 1;
    }


    /* =====================================================
       CATALOG POSITION
    ===================================================== */

    .wl-overlay {
      position: absolute;

      top: 10px;
      right: 10px;

      z-index: 999;

      pointer-events: none;
    }

    .wl-overlay .wl-btn {
      pointer-events: auto;
    }

    .resource-card,
    .card-wrapper,
    .card,
    .product-card,
    .product-item,
    .product-grid-item,
    .product,
    .product-block,
    .product-card-wrapper {
      position: relative;
    }


    /* =====================================================
       PRODUCT PAGE

       Больше НЕ fixed.
       Больше НЕ position relative to image.
       Кнопка находится внутри group-block.
    ===================================================== */

    [data-wishlist-product="true"] {
      flex: 0 0 auto;

      margin-top: 10px;
    }


    /* =====================================================
       TOAST

       Только сообщение о лимите wishlist.
       Никакого drawer.
    ===================================================== */

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
        0 0 25px
        rgba(255,80,50,.45),

        0 0 60px
        rgba(255,60,60,.35);

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

  /* =========================================================
     INIT
  ========================================================= */

  function refreshWishlistUI() {
    injectHeader();
    injectHearts();
    injectProductHeart();
  }

  function initWishlist() {
    refreshWishlistUI();
    cleanupWishlist();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWishlist, { once: true });
  } else {
    initWishlist();
  }

  /*
   * Shopify theme editor
   */
  document.addEventListener("shopify:section:load", refreshWishlistUI);

  document.addEventListener("shopify:section:select", refreshWishlistUI);

  document.addEventListener("shopify:section:reorder", refreshWishlistUI);

  document.addEventListener("shopify:block:select", refreshWishlistUI);

  /* =========================================================
     MUTATION OBSERVER
  ========================================================= */

  let refreshTimer = null;

  const observer = new MutationObserver(() => {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
      refreshWishlistUI();
    }, 200);
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
