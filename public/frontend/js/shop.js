/* =========================================================
   shop.js — Shop detail page, cart page, wishlist page,
   add-to-cart, add-to-wishlist, book-service actions.
   ========================================================= */

const TatitoShop = (() => {
  function findStoreById(id) {
    return (STORES || []).find((s) => s.id === id);
  }

  function getStoreItems(store) {
    const items = [];
    if (Array.isArray(store?.products)) items.push(...store.products.map((i) => ({ ...i, type: "product" })));
    if (Array.isArray(store?.services)) items.push(...store.services.map((i) => ({ ...i, type: "service" })));
    return items;
  }

  function findStoreItem(storeId, itemId) {
    const store = findStoreById(storeId);
    if (!store) return null;
    const items = getStoreItems(store);
    const item = items.find((i) => i.id === itemId);
    return item ? { store, item } : { store, item: null };
  }

  function renderShopDetail() {
    const root = document.getElementById("shopDetailRoot");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const storeId = params.get("shop");
    const store = findStoreById(storeId);

    if (!store) {
      root.innerHTML = `<p class="empty-state">${t("errorOccurred")}</p>`;
      return;
    }

    const products = (store.products || []).map((i) => ({ ...i, type: "product" }));
    const services = (store.services || []).map((i) => ({ ...i, type: "service" }));

    root.innerHTML = `
      <section class="category-hero">
        <div>
          <p class="eyebrow">${store.category}</p>
          <h1>${store.name}</h1>
          <p>${store.description}</p>
          <div class="store-meta" style="margin-top:12px;">
            <span class="store-rating">★ ${store.rating} (${store.reviewCount || 0} ${t("reviewCount")})</span>
            <span class="store-open ${store.open ? "" : "closed"}">${store.open ? t("openNowBadge") : t("currentlyClosed")}</span>
            <span style="color:var(--muted);">${formatDistance(store.distance)}</span>
          </div>
        </div>
        <div class="hero-card">
          <h3>${store.open ? t("openNowBadge") : t("currentlyClosed")}</h3>
          <p>${formatDistance(store.distance)} • ★ ${store.rating}</p>
        </div>
      </section>
      ${products.length ? `
        <section class="section" style="padding:0;">
          <div class="section-head">
            <div>
              <h2>${t("shopProducts")}</h2>
              <p>${t("shopProductsDesc")}</p>
            </div>
          </div>
          <div class="store-grid">${products.map((item) => renderProductCard(store, item)).join("")}</div>
        </section>
      ` : ""}
      ${services.length ? `
        <section class="section" style="padding:0;margin-top:32px;">
          <div class="section-head">
            <div>
              <h2>${t("bookServices")}</h2>
              <p>${t("bookServicesDesc")}</p>
            </div>
          </div>
          <div class="store-grid">${services.map((item) => renderServiceCard(store, item)).join("")}</div>
        </section>
      ` : ""}
      ${renderPackagesSection(store)}
      ${renderReviewsSection(store)}
    `;
  }

  /* ---- Package section for photography & event stores (Req 14, 15) ---- */
  function renderPackagesSection(store) {
    const photoPackages = PHOTOGRAPHY_PACKAGES[store.id];
    const eventPackages = EVENT_PACKAGES[store.id];
    const packages = photoPackages || eventPackages;
    if (!packages) return "";

    const isPhoto = !!photoPackages;
    return `
      <section class="section" style="padding:0;margin-top:32px;">
        <div class="section-head">
          <div>
            <h2>${isPhoto ? "📷 Photography Packages" : "🎊 Event Packages"}</h2>
            <p>${isPhoto ? "Select a package, choose your date and time, and book instantly." : "Compare packages and book the perfect service for your event."}</p>
          </div>
        </div>
        ${packages.map((pkg) => `
          <div class="package-card" data-package-id="${pkg.id}" data-store-id="${store.id}">
            <span class="pkg-tag ${pkg.type}">${pkg.type}</span>
            <h3 style="font-family:var(--font-display);font-size:20px;">${pkg.name}</h3>
            ${pkg.duration ? `<p style="font-size:13px;color:var(--muted);">⏱ ${pkg.duration}</p>` : ""}
            <div style="margin:10px 0;">
              <span style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--ruby);">${formatPrice(pkg.price)}</span>
              ${pkg.type === "standard" || pkg.type === "premium" ? '<span style="font-size:13px;color:var(--muted);"> / unit</span>' : ""}
            </div>
            <ul class="pkg-features">
              ${pkg.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            <div class="form-row" style="margin-top:14px;">
              <div class="form-field">
                <label style="font-size:12px;">Booking Date</label>
                <input type="date" class="pkg-date" data-pkg-id="${pkg.id}" min="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div class="form-field">
                <label style="font-size:12px;">Time</label>
                <input type="time" class="pkg-time" data-pkg-id="${pkg.id}" />
              </div>
            </div>
            <button class="btn btn-primary small" style="margin-top:10px;"
              data-action="book-package" data-store-id="${store.id}" data-pkg-id="${pkg.id}"
              data-pkg-name="${pkg.name}" data-pkg-price="${pkg.price}" data-pkg-type="${pkg.type}">
              Book This Package
            </button>
          </div>
        `).join("")}
      </section>
    `;
  }

  /* ---- Reviews section (Req 18) ---- */
  function renderReviewsSection(store) {
    const reviews = TatitoStore.getReviewsForShop(store.id);
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : store.rating;
    const reviewCount = reviews.length || store.reviewCount || 0;

    return `
      <section class="section" style="padding:0;margin-top:32px;">
        <div class="section-head">
          <div>
            <h2>⭐ Reviews &amp; Ratings</h2>
            <p>${avgRating} ★ · ${reviewCount} review${reviewCount !== 1 ? "s" : ""}</p>
          </div>
          ${TatitoStore.isLoggedIn() ? `
            <button class="btn btn-ghost small" data-action="toggle-review-form">Write a Review</button>
          ` : ""}
        </div>
        <div id="reviewFormContainer" style="display:none;margin-bottom:20px;">
          <div class="checkout-panel">
            <h3>Share Your Experience</h3>
            <div class="star-rating-input" id="reviewStarInput">
              ${[1,2,3,4,5].map((n) => `<span data-star="${n}">★</span>`).join("")}
            </div>
            <div class="form-field" style="margin-top:12px;">
              <label>Your Review</label>
              <textarea id="reviewTextInput" rows="3" placeholder="Tell others about your experience..."></textarea>
            </div>
            <div class="form-field">
              <label>Add Photos (optional)</label>
              <div class="upload-zone" id="reviewPhotoZone" style="padding:16px;">
                <div class="upload-icon">📷</div>
                <p>Click to upload review photos</p>
              </div>
              <input type="file" id="reviewPhotoInput" accept="image/*" multiple style="display:none;" />
              <div id="reviewPhotoPreview" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;"></div>
            </div>
            <button class="btn btn-primary" id="submitReviewBtn" data-store-id="${store.id}" style="margin-top:12px;">Submit Review</button>
          </div>
        </div>
        <div id="reviewsList">
          ${reviews.length ? reviews.map((r) => `
            <div class="review-card">
              <div class="review-head">
                <div>
                  <strong>${escapeHtml(r.userName || "Customer")}</strong>
                  <span class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                </div>
                <span style="font-size:12px;color:var(--muted);">${new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <p>${escapeHtml(r.text || "")}</p>
              ${r.images && r.images.length ? `<div class="review-images">${r.images.map((img) => `<img src="${img}" alt="Review photo" />`).join("")}</div>` : ""}
            </div>
          `).join("") : `<p style="color:var(--muted);padding:20px 0;">No reviews yet. Be the first to review!</p>`}
        </div>
      </section>
    `;
  }

  function renderProductCard(store, item) {
    const images = Array.isArray(item.images) && item.images.length ? item.images : [item.image || ""];
    const options = Array.isArray(item.variantOptions) && item.variantOptions.length ? item.variantOptions : [];
    const showVariant = item.variantType && item.variantType !== "none";
    const discount = item.originalPrice && item.originalPrice > item.price
      ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

    return `
      <div class="store-card product-card">
        <div class="product-media-wrap">
          <img class="product-image" src="${images[0]}" alt="${escapeHtml(item.name)}" />
          ${images.length > 1 ? `<div class="product-thumbnail-row">
            ${images.map((img, idx) => `
              <button class="product-thumb ${idx === 0 ? "active" : ""}" type="button" data-action="swap-image" data-image-index="${idx}">
                <img src="${img}" alt="${escapeHtml(item.name)} ${idx + 1}" />
              </button>
            `).join("")}
          </div>` : ""}
        </div>
        <div class="store-body">
          <p class="store-cat">${t("product")}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="store-desc">${escapeHtml(item.description)}</p>
          <div class="store-meta">
            <span>
              <span class="price-tag">${formatPrice(item.price)}</span>
              ${item.originalPrice ? `<span class="price-original">${formatPrice(item.originalPrice)}</span>` : ""}
              ${discount ? `<span class="discount-badge">-${discount}%</span>` : ""}
            </span>
            <span class="store-open ${item.stock > 0 ? "" : "closed"}">${item.stock > 0 ? (item.stock <= 5 ? t("lowStock") : t("inStock")) : t("outOfStock")}</span>
          </div>
          ${showVariant ? `
            <div class="product-variant-row">
              <label class="size-label">${item.variantLabel || t("chooseSize")}</label>
              <select class="size-select compact" data-variant-select>
                <option value="">${item.variantType === "size" ? t("selectSize") : t("selectOption")}</option>
                ${options.map((o) => `<option value="${o}">${o}</option>`).join("")}
              </select>
            </div>
          ` : `<div class="variant-pill">${t("noSizeNeeded")}</div>`}
          <div class="store-actions compact-actions">
            <button class="btn btn-primary small" data-action="add-cart" data-store-id="${store.id}" data-item-id="${item.id}" ${item.stock <= 0 ? "disabled" : ""}>${t("addToCart")}</button>
            <button class="btn btn-ghost small" data-action="add-wishlist" data-store-id="${store.id}" data-item-id="${item.id}">❤ ${t("wishlist")}</button>
          </div>
        </div>
      </div>`;
  }

  function renderServiceCard(store, item) {
    return `
      <div class="store-card product-card">
        <div class="product-media-wrap">
          <img class="product-image" src="${item.image || ""}" alt="${escapeHtml(item.name)}" />
        </div>
        <div class="store-body">
          <p class="store-cat">${t("service")}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="store-desc">${escapeHtml(item.description)}</p>
          <div class="store-meta">
            <span class="price-tag">${formatPrice(item.price)}</span>
            <span class="store-open">${t("bookable")}</span>
          </div>
          <div class="store-actions compact-actions">
            <button class="btn btn-primary small" data-action="book-service" data-store-id="${store.id}" data-item-id="${item.id}">${t("bookService")}</button>
            <button class="btn btn-ghost small" data-action="add-wishlist" data-store-id="${store.id}" data-item-id="${item.id}">❤ ${t("wishlist")}</button>
          </div>
        </div>
      </div>`;
  }

  function addToCart(storeId, itemId, variant = "") {
    const lookup = findStoreItem(storeId, itemId);
    if (!lookup?.store) return;
    if (!TatitoStore.isLoggedIn()) {
      showToast(t("loginToAdd"), "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const item = lookup.item || { id: `${storeId}-shop`, name: lookup.store.name, price: 0, description: lookup.store.description, type: "product" };
    const needsVariant = item.variantType === "size" || item.variantType === "variant";
    if (needsVariant && !variant) {
      showToast(item.variantType === "size" ? t("selectVariantFirst") : t("selectVariantOptionFirst"), "error");
      return;
    }
    TatitoStore.addToCart(storeId, itemId, {
      name: item.name, price: item.price, image: item.image,
      variantType: item.variantType, shopName: lookup.store.name, category: lookup.store.category
    }, variant);
    showToast(`${item.name}${variant ? ` • ${variant}` : ""} ${t("addedToCart")}`, "success");
  }

  function addToWishlist(storeId, itemId) {
    const lookup = findStoreItem(storeId, itemId);
    if (!lookup?.store) return;
    if (!TatitoStore.isLoggedIn()) {
      showToast(t("loginToWishlist"), "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const item = lookup.item || { id: `${storeId}-shop`, name: lookup.store.name, price: 0, image: "", shopName: lookup.store.name, category: lookup.store.category };
    const added = TatitoStore.addToWishlist(storeId, itemId, {
      name: item.name, price: item.price, image: item.image, shopName: lookup.store.name, category: lookup.store.category
    });
    showToast(added ? `${item.name} ${t("addedToWishlist")}` : t("alreadyInWishlist"), added ? "success" : "");
  }

  function bookService(storeId, itemId) {
    const lookup = findStoreItem(storeId, itemId);
    if (!lookup?.store || !lookup.item || lookup.item.type !== "service") return;
    if (!TatitoStore.isLoggedIn()) {
      showToast(t("loginToAdd"), "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    TatitoStore.addBooking(storeId, itemId, {
      name: lookup.item.name, price: lookup.item.price, image: lookup.item.image,
      shopName: lookup.store.name, category: lookup.store.category, type: "service"
    });
    showToast(`${lookup.item.name} ${t("bookingAdded")}`, "success");
  }

  function removeFromCart(itemKey) {
    TatitoStore.removeFromCart(itemKey);
    showToast(t("itemRemoved"));
    renderCartPage();
  }

  function removeFromWishlist(itemKey) {
    TatitoStore.removeFromWishlist(itemKey);
    showToast(t("itemRemoved"));
    renderWishlistPage();
  }

  function moveWishlistToCart(itemKey) {
    const item = TatitoStore.getWishlist().find((w) => w.itemKey === itemKey);
    if (!item) return;
    addToCart(item.shopId, item.id);
    removeFromWishlist(itemKey);
  }

  function renderCartPage() {
    const container = document.getElementById("cartItems");
    const bookingsEl = document.getElementById("cartBookings");
    const summary = document.getElementById("cartSummary");
    const cartItems = TatitoStore.getCart();
    const bookings = TatitoStore.getBookings();

    if (container) {
      if (!cartItems.length) {
        container.innerHTML = `<p class="empty-state">${t("yourCartEmpty")}</p>`;
      } else {
        container.innerHTML = cartItems.map((item) => `
          <div class="cart-item">
            ${item.image ? `<img class="cart-item-thumb" src="${item.image}" alt="${escapeHtml(item.name)}" />` : ""}
            <div class="cart-item-info">
              <h3>${escapeHtml(item.name)}</h3>
              <p>${item.shopName || item.category || ""}</p>
              <span>${formatPrice(item.price)} ${t("qty")} ${item.quantity || 1}${item.variant ? ` • ${item.variant}` : ""}</span>
              <div class="qty-controls">
                <button class="qty-btn" data-action="qty-dec" data-item-key="${item.itemKey}">−</button>
                <span class="qty-display">${item.quantity || 1}</span>
                <button class="qty-btn" data-action="qty-inc" data-item-key="${item.itemKey}">+</button>
              </div>
            </div>
            <button class="btn btn-ghost small" data-action="remove-cart" data-item-key="${item.itemKey}">${t("remove")}</button>
          </div>
        `).join("");
      }
    }

    if (bookingsEl) {
      if (bookings.length) {
        bookingsEl.innerHTML = bookings.map((b) => `
          <div class="cart-item">
            ${b.image ? `<img class="cart-item-thumb" src="${b.image}" alt="${escapeHtml(b.name)}" />` : ""}
            <div class="cart-item-info">
              <h3>${escapeHtml(b.name)}</h3>
              <p>${b.shopName || ""}</p>
              <span>${formatPrice(b.price)} • ${t("service")}</span>
            </div>
          </div>
        `).join("");
      } else {
        bookingsEl.innerHTML = "";
      }
    }

    if (summary) {
      const subtotal = TatitoStore.cartSubtotal();
      const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 99) : 0;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + shipping + tax;
      summary.innerHTML = `
        <h3>${t("orderSummary")}</h3>
        <div class="cart-summary-row"><span>${t("itemsLabel")}: ${cartItems.length}</span></div>
        <div class="cart-summary-row"><span>${t("subtotal")}</span><span>${formatPrice(subtotal)}</span></div>
        <div class="cart-summary-row"><span>${t("shipping")}</span><span>${shipping === 0 ? t("free") : formatPrice(shipping)}</span></div>
        <div class="cart-summary-row"><span>${t("tax")}</span><span>${formatPrice(tax)}</span></div>
        <div class="cart-summary-row total"><span>${t("total")}</span><span>${formatPrice(total)}</span></div>
      `;
    }
  }

  function renderWishlistPage() {
    const container = document.getElementById("wishlistItems");
    if (!container) return;
    const items = TatitoStore.getWishlist();
    if (!items.length) {
      container.innerHTML = `<p class="empty-state">${t("wishlistEmpty")}</p>`;
      return;
    }
    container.innerHTML = items.map((item) => `
      <div class="cart-item">
        ${item.image ? `<img class="cart-item-thumb" src="${item.image}" alt="${escapeHtml(item.name)}" />` : ""}
        <div class="cart-item-info">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${item.shopName || item.category || ""}</p>
          <span>${formatPrice(item.price)}</span>
        </div>
        <div class="stacked-actions">
          <button class="btn btn-primary small" data-action="move-wishlist-to-cart" data-item-key="${item.itemKey}">${t("moveToCart")}</button>
          <button class="btn btn-ghost small" data-action="remove-wishlist" data-item-key="${item.itemKey}">${t("remove")}</button>
        </div>
      </div>
    `).join("");
  }

  /* ---- Book a photography/event package (Req 14, 15) ---- */
  function bookPackage(btn) {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to book a package", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const pkgId = btn.dataset.pkgId;
    const card = btn.closest(".package-card");
    const date = card?.querySelector(`.pkg-date[data-pkg-id="${pkgId}"]`)?.value;
    const time = card?.querySelector(`.pkg-time[data-pkg-id="${pkgId}"]`)?.value;

    if (!date) { showToast("Please select a booking date", "error"); return; }

    const storeId = btn.dataset.storeId;
    const store = findStoreById(storeId);
    const pkgName = btn.dataset.pkgName;
    const pkgPrice = parseFloat(btn.dataset.pkgPrice);

    TatitoStore.addBooking(storeId, `pkg-${pkgId}`, {
      name: `${pkgName} (${date}${time ? " " + time : ""})`,
      price: pkgPrice,
      image: store?.emoji ? undefined : "",
      shopName: store?.name || "",
      category: store?.category || "",
      type: "package",
      bookingDate: date,
      bookingTime: time,
    });
    TatitoStore.addNotification({
      title: "Package Booked 📅",
      message: `${pkgName} booked for ${date}${time ? " at " + time : ""}. Confirmation pending.`,
      type: "booking",
      icon: "📅"
    });
    showToast(`Package booked for ${date}! Check cart to proceed.`, "success");
  }

  function handleClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const storeId = btn.dataset.storeId;
    const itemId = btn.dataset.itemId;
    const itemKey = btn.dataset.itemKey;
    const card = btn.closest(".store-card");
    const variant = card?.querySelector("select[data-variant-select]")?.value || "";

    if (action === "swap-image") {
      const mainImg = card?.querySelector(".product-image");
      const nextImg = btn.querySelector("img")?.src;
      if (mainImg && nextImg) {
        mainImg.src = nextImg;
        card?.querySelectorAll(".product-thumb").forEach((th) => th.classList.remove("active"));
        btn.classList.add("active");
      }
      return;
    }

    if (action === "add-cart") addToCart(storeId, itemId, variant);
    else if (action === "add-wishlist") addToWishlist(storeId, itemId);
    else if (action === "book-service") bookService(storeId, itemId);
    else if (action === "book-package") bookPackage(btn);
    else if (action === "toggle-review-form") {
      const form = document.getElementById("reviewFormContainer");
      if (form) form.style.display = form.style.display === "none" ? "block" : "none";
    }
    else if (action === "remove-cart") removeFromCart(itemKey);
    else if (action === "remove-wishlist") removeFromWishlist(itemKey);
    else if (action === "move-wishlist-to-cart") moveWishlistToCart(itemKey);
    else if (action === "qty-inc") {
      const item = TatitoStore.getCart().find((c) => c.itemKey === itemKey);
      if (item) { TatitoStore.updateCartQty(itemKey, (item.quantity || 1) + 1); renderCartPage(); }
    } else if (action === "qty-dec") {
      const item = TatitoStore.getCart().find((c) => c.itemKey === itemKey);
      if (item && item.quantity > 1) { TatitoStore.updateCartQty(itemKey, item.quantity - 1); renderCartPage(); }
      else if (item) { removeFromCart(itemKey); }
    } else if (action === "confirm-appointments") {
      const bookings = TatitoStore.getBookings();
      if (!bookings.length) { showToast(t("noAppointments")); return; }
      const order = TatitoStore.createOrder({
        items: bookings, total: bookings.reduce((s, b) => s + Number(b.price || 0), 0),
        paymentMethod: "service_booking", status: "confirmed"
      });
      TatitoStore.clearBookings();
      window.location.href = `order-success.html?id=${order.id}`;
    }
  }

  function init() {
    const page = document.body.dataset.page;
    if (page === "shop") renderShopDetail();
    if (page === "cart") {
      renderCartPage();
      document.getElementById("clearCartBtn")?.addEventListener("click", () => {
        TatitoStore.clearCart();
        showToast(t("cartCleared"));
        renderCartPage();
      });
    }
    if (page === "wishlist") renderWishlistPage();
    document.addEventListener("click", handleClick);

    // Review system handlers (Req 18)
    setupReviewHandlers();

    window.addEventListener("languagechange", () => {
      if (page === "shop") renderShopDetail();
      if (page === "cart") renderCartPage();
      if (page === "wishlist") renderWishlistPage();
    });
  }

  /* ---- Review system (Req 18) ---- */
  let reviewRating = 0;
  let reviewPhotos = [];
  function setupReviewHandlers() {
    document.addEventListener("click", (e) => {
      // Star rating input
      const star = e.target.closest("#reviewStarInput span");
      if (star) {
        reviewRating = parseInt(star.dataset.star);
        const all = star.parentElement.querySelectorAll("span");
        all.forEach((s, i) => s.classList.toggle("active", i < reviewRating));
      }

      // Submit review
      const submitBtn = e.target.closest("#submitReviewBtn");
      if (submitBtn) {
        const storeId = submitBtn.dataset.storeId;
        const text = document.getElementById("reviewTextInput")?.value || "";
        if (!reviewRating) { showToast("Please select a star rating", "error"); return; }
        const user = TatitoStore.getUser();
        TatitoStore.addReview({
          shopId: storeId,
          rating: reviewRating,
          text,
          images: reviewPhotos,
          userName: user.name,
        });
        TatitoStore.addNotification({
          title: "Review Submitted ⭐",
          message: "Thank you for your review! It helps other customers.",
          type: "review",
          icon: "⭐"
        });
        showToast("Review submitted! Thank you.", "success");
        reviewRating = 0;
        reviewPhotos = [];
        renderShopDetail();
      }
    });

    // Review photo upload
    document.addEventListener("change", (e) => {
      if (e.target.id === "reviewPhotoInput") {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            reviewPhotos.push(ev.target.result);
            const preview = document.getElementById("reviewPhotoPreview");
            if (preview) {
              preview.innerHTML = reviewPhotos.map((img) =>
                `<img src="${img}" class="preview-thumb" alt="Review photo" />`
              ).join("");
            }
          };
          reader.readAsDataURL(file);
        });
      }
    });

    // Review photo zone click
    document.addEventListener("click", (e) => {
      if (e.target.closest("#reviewPhotoZone")) {
        document.getElementById("reviewPhotoInput")?.click();
      }
    });
  }

  return { init, addToCart, addToWishlist, bookService, renderCartPage, renderWishlistPage, renderShopDetail };
})();

document.addEventListener("DOMContentLoaded", () => TatitoShop.init());
