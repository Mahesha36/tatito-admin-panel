/* =========================================================
   products.js — All-products browsing page with filters.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "products") return;

  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("productCount");

  // Populate category filter
  const catFilter = document.getElementById("filterCategory");
  const cats = [...new Set(STORES.map((s) => s.category))].sort();
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    catFilter.appendChild(opt);
  });

  function getAllProducts() {
    const items = [];
    STORES.forEach((store) => {
      (store.products || []).forEach((p) => {
        items.push({
          ...p,
          storeId: store.id,
          storeName: store.name,
          storeRating: store.rating,
          category: store.category
        });
      });
    });
    return items;
  }

  function getFiltered() {
    let items = getAllProducts();
    const search = document.getElementById("productSearchInput").value.trim().toLowerCase();
    const cat = catFilter.value;
    const sort = document.getElementById("filterSort").value;
    const minP = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxP = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const inStock = document.getElementById("inStockOnly").checked;
    const onSale = document.getElementById("onSaleOnly").checked;

    if (search) items = items.filter((p) => p.name.toLowerCase().includes(search) || p.storeName.toLowerCase().includes(search));
    if (cat !== "all") items = items.filter((p) => p.category === cat);
    items = items.filter((p) => p.price >= minP && p.price <= maxP);
    if (inStock) items = items.filter((p) => p.stock > 0);
    if (onSale) items = items.filter((p) => p.originalPrice);

    switch (sort) {
      case "price-low": items.sort((a, b) => a.price - b.price); break;
      case "price-high": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.storeRating - a.storeRating); break;
      case "discount": items.sort((a, b) => (b.originalPrice ? (1 - b.price / b.originalPrice) : 0) - (a.originalPrice ? (1 - a.price / a.originalPrice) : 0)); break;
      default: items.sort((a, b) => b.storeRating - a.storeRating);
    }
    return items;
  }

  function renderProductCard(p) {
    const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    return `
      <div class="product-card">
        <a href="shop.html?shop=${p.storeId}" class="product-card-media">
          ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        </a>
        <div class="product-card-body">
          <p class="product-card-store">${escapeHtml(p.storeName)} · ★${p.storeRating}</p>
          <a href="shop.html?shop=${p.storeId}"><h3>${escapeHtml(p.name)}</h3></a>
          <div class="product-card-price">
            <span class="price-now">${formatPrice(p.price)}</span>
            ${p.originalPrice ? `<span class="price-was">${formatPrice(p.originalPrice)}</span>` : ""}
          </div>
          <button class="btn btn-primary small block product-quick-add"
            data-store-id="${p.storeId}"
            data-item-id="${p.id}"
            ${p.stock <= 0 ? "disabled" : ""}>
            ${p.stock <= 0 ? "Out of Stock" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>`;
  }

  function render() {
    const items = getFiltered();
    countEl.textContent = `${items.length} product${items.length !== 1 ? "s" : ""}`;
    if (!items.length) {
      grid.innerHTML = `<p class="empty-state">No products match your filters. Try adjusting your search.</p>`;
      return;
    }
    grid.innerHTML = items.map(renderProductCard).join("");
  }

  // Search
  document.getElementById("productSearchForm").addEventListener("submit", (e) => e.preventDefault());
  document.getElementById("productSearchInput").addEventListener("input", render);

  // Filters
  catFilter.addEventListener("change", render);
  document.getElementById("filterSort").addEventListener("change", render);
  document.getElementById("minPrice").addEventListener("input", render);
  document.getElementById("maxPrice").addEventListener("input", render);
  document.getElementById("inStockOnly").addEventListener("change", render);
  document.getElementById("onSaleOnly").addEventListener("change", render);

  document.getElementById("clearProductFilters").addEventListener("click", () => {
    document.getElementById("productSearchInput").value = "";
    catFilter.value = "all";
    document.getElementById("filterSort").value = "popular";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("inStockOnly").checked = false;
    document.getElementById("onSaleOnly").checked = false;
    render();
  });

  render();
});
