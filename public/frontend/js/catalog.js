/* =========================================================
   catalog.js — Category page with filtering, sorting, search.
   Runs on category.html (checks for categoryPageTitle).
   ========================================================= */

const TatitoCatalog = (() => {
  const normalize = (v) => String(v || "").toLowerCase().trim();

  function getCategoryBySlug(slug) {
    const s = normalize(slug);
    return CATEGORIES.find((c) => normalize(c.slug) === s || normalize(c.id) === s);
  }

  function getStoreItems(store) {
    const items = [];
    if (Array.isArray(store?.products)) items.push(...store.products.map((i) => ({ ...i, type: "product" })));
    if (Array.isArray(store?.services)) items.push(...store.services.map((i) => ({ ...i, type: "service" })));
    return items;
  }

  function getFilteredStores(search, categorySlug, filters) {
    const query = normalize(search);
    const category = normalize(categorySlug);
    let stores = STORES.filter((store) => {
      if (category && normalize(store.categoryId) !== category) return false;
      if (query) {
        const haystack = [store.name, store.category, store.description, ...(store.tags || [])].join(" ").toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filters?.openNow && !store.open) return false;
      if (filters?.minRating && store.rating < filters.minRating) return false;
      if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
        const items = getStoreItems(store);
        const prices = items.map((i) => i.price).filter((p) => p !== undefined);
        if (prices.length === 0 && (filters.minPrice > 0 || filters.maxPrice !== undefined)) return false;
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        if (filters.minPrice !== undefined && maxP < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && minP > filters.maxPrice) return false;
      }
      return true;
    });
    return stores;
  }

  function sortStoresBy(stores, sortKey) {
    const arr = [...stores];
    switch (sortKey) {
      case "rating": return arr.sort((a, b) => b.rating - a.rating);
      case "priceLow": return arr.sort((a, b) => minPrice(a) - minPrice(b));
      case "priceHigh": return arr.sort((a, b) => maxPrice(b) - maxPrice(a));
      case "distance":
      default: return arr.sort((a, b) => a.distance - b.distance);
    }
  }

  function minPrice(store) {
    const items = getStoreItems(store);
    const prices = items.map((i) => i.price).filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : 0;
  }
  function maxPrice(store) {
    const items = getStoreItems(store);
    const prices = items.map((i) => i.price).filter((p) => p > 0);
    return prices.length ? Math.max(...prices) : 0;
  }

  function renderCategoryPage() {
    const titleEl = document.getElementById("categoryPageTitle");
    const descEl = document.getElementById("categoryPageDescription");
    const chipsEl = document.getElementById("categoryChipList");
    const resultsHeadingEl = document.getElementById("resultsHeading");
    const resultsSummaryEl = document.getElementById("resultsSummary");
    const searchInput = document.getElementById("catalogSearchInput");
    const storeGrid = document.getElementById("storeGrid");
    const sortSelect = document.getElementById("sortSelect");
    if (!titleEl || !storeGrid) return;

    const params = new URLSearchParams(window.location.search);
    const categorySlug = normalize(params.get("category"));
    const searchValue = normalize(params.get("search"));
    const category = getCategoryBySlug(categorySlug);

    const filters = getActiveFilters();
    let stores = getFilteredStores(searchValue, categorySlug, filters);
    const sortKey = sortSelect?.value || "distance";
    stores = sortStoresBy(stores, sortKey);

    const heading = category ? category.name : searchValue ? t("searchResults") : t("browseAll");
    const desc = category ? category.description : searchValue
      ? `${t("showingResults")} "${searchValue}"`
      : t("catalogDesc");

    titleEl.textContent = heading;
    if (descEl) descEl.textContent = desc;
    if (resultsHeadingEl) resultsHeadingEl.textContent = category ? `${category.name}` : searchValue ? t("matchingVendors") : t("featuredVendors");
    if (resultsSummaryEl) resultsSummaryEl.textContent = stores.length
      ? `${t("showingResults")} ${stores.length} ${t("resultsCount")}`
      : t("noVendors");

    if (chipsEl) {
      chipsEl.innerHTML = CATEGORIES.map((cat) => `
        <a class="category-badge ${category?.slug === cat.slug ? "active" : ""}" href="category.html?category=${cat.slug}">${cat.emoji} ${cat.name}</a>
      `).join("");
    }

    if (searchInput) searchInput.value = searchValue;

    if (!stores.length) {
      storeGrid.innerHTML = `<p class="empty-state">${t("noVendors")}</p>`;
      return;
    }

    storeGrid.innerHTML = stores.map((store) => renderCatalogStoreCard(store)).join("");
  }

  function renderCatalogStoreCard(store) {
    const products = (store.products || []).slice(0, 4);
    return `
      <div class="catalog-store-card">
        <a href="shop.html?shop=${store.id}" class="catalog-store-header">
          <div class="store-media">
            <span class="store-badge">${store.badge}</span>
            <span class="store-dist">${formatDistance(store.distance)}</span>
            ${store.image
              ? `<img src="${store.image}" alt="${store.name}" class="store-media-img" loading="lazy" />`
              : `<span>${store.emoji}</span>`}
          </div>
          <div class="store-body">
            <h3>${store.name}</h3>
            <p class="store-cat">${store.category}</p>
            <div class="store-meta">
              <span class="store-rating">★ ${store.rating} <span style="color:var(--muted);font-weight:400;">(${store.reviewCount || 0})</span></span>
              <span class="store-open ${store.open ? "" : "closed"}">${store.open ? t("openNow") : t("closed")}</span>
            </div>
          </div>
        </a>
        ${products.length ? `
          <div class="catalog-products-strip">
            ${products.map((item) => `
              <div class="catalog-product-mini">
                <a href="shop.html?shop=${store.id}">
                  <img src="${item.image}" alt="${escapeHtml(item.name)}" class="catalog-product-thumb" loading="lazy" />
                </a>
                <div class="catalog-product-info">
                  <p class="catalog-product-name">${escapeHtml(item.name)}</p>
                  <span class="price-tag" style="font-size:13px;">${formatPrice(item.price)}</span>
                </div>
                <button class="btn btn-primary small catalog-add-cart-btn"
                  data-action="catalog-add-cart"
                  data-store-id="${store.id}"
                  data-item-id="${item.id}"
                  ${item.stock <= 0 ? "disabled" : ""}>
                  🛒 Add
                </button>
              </div>
            `).join("")}
          </div>
        ` : `<div class="catalog-products-empty"><p>No products yet. <a href="shop.html?shop=${store.id}">View shop services →</a></p></div>`}
        <div class="catalog-store-footer">
          <a href="shop.html?shop=${store.id}" class="btn btn-ghost small">View Shop →</a>
        </div>
      </div>`;
  }

  function getActiveFilters() {
    const minPrice = parseFloat(document.getElementById("minPrice")?.value) || undefined;
    const maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || undefined;
    const minRating = parseFloat(document.querySelector('input[name="rating"]:checked')?.value) || 0;
    const openNow = document.getElementById("openNowFilter")?.checked || false;
    return { minPrice, maxPrice, minRating: minRating > 0 ? minRating : undefined, openNow };
  }

  function setupCategorySearch() {
    const form = document.getElementById("catalogSearchForm");
    const input = document.getElementById("catalogSearchInput");
    if (!form || !input) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      updateUrl(input.value.trim(), getCategorySlug());
      renderCategoryPage();
    });
    input.addEventListener("input", () => {
      updateUrl(input.value.trim(), getCategorySlug());
      renderCategoryPage();
    });
  }

  function getCategorySlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "";
  }

  function updateUrl(search, categorySlug) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categorySlug) params.set("category", categorySlug);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  function initCatalog() {
    renderCategoryPage();
    setupCategorySearch();

    document.getElementById("sortSelect")?.addEventListener("change", renderCategoryPage);
    document.getElementById("applyFiltersBtn")?.addEventListener("click", renderCategoryPage);
    document.getElementById("clearFiltersBtn")?.addEventListener("click", () => {
      document.getElementById("minPrice").value = "";
      document.getElementById("maxPrice").value = "";
      document.getElementById("openNowFilter").checked = false;
      const ratingDefault = document.querySelector('input[name="rating"][value="0"]');
      if (ratingDefault) ratingDefault.checked = true;
      renderCategoryPage();
    });

    window.addEventListener("languagechange", renderCategoryPage);

    // Handle quick add-to-cart from catalog
    document.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="catalog-add-cart"]');
      if (!btn) return;
      e.preventDefault();
      const storeId = btn.dataset.storeId;
      const itemId = btn.dataset.itemId;
      quickAddToCart(storeId, itemId);
    });
  }

  function quickAddToCart(storeId, itemId) {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to add items to cart", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const store = (STORES || []).find((s) => s.id === storeId);
    if (!store) return;
    const products = store.products || [];
    const item = products.find((p) => p.id === itemId);
    if (!item) return;

    // If item needs a variant, redirect to shop page
    if (item.variantType && item.variantType !== "none") {
      showToast("Please select a size on the shop page", "");
      setTimeout(() => { window.location.href = `shop.html?shop=${storeId}`; }, 800);
      return;
    }

    TatitoStore.addToCart(storeId, itemId, {
      name: item.name,
      price: item.price,
      image: item.image,
      shopName: store.name,
      category: store.category
    });
    showToast(`${item.name} added to cart`, "success");
  }

  return { initCatalog, renderCategoryPage, getFilteredStores, getCategoryBySlug, quickAddToCart };
})();

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "category") {
    TatitoCatalog.initCatalog();
  }
});
