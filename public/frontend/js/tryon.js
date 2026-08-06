/* =========================================================
   tryon.js — AI Virtual Dress Try-On
   Upload photo → select product → canvas overlay preview
   Compare colors and sizes before purchase.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "try-on") return;

  const root = document.getElementById("tryonRoot");
  if (!root) return;

  let userPhoto = null;
  let selectedProduct = TRYON_PRODUCTS[0];
  let selectedColor = TRYON_PRODUCTS[0].colors[0];
  let selectedSize = "M";
  const colorMap = {
    Red: "#c0392b", "Royal Blue": "#1a4b8c", Green: "#1e8449", Maroon: "#641e16",
    Cream: "#f5e6c8", Navy: "#1a237e", Gold: "#c9a24b", Black: "#1a1a1a",
    "Emerald": "#00895e", Wine: "#6b1f3a", Charcoal: "#36454f", Grey: "#7f8c8d",
    Pink: "#e91e63", Orange: "#e67e22", Teal: "#008080", Purple: "#6c3483",
  };

  function render() {
    root.innerHTML = `
      <div class="tryon-studio">
        <!-- LEFT: Your Photo -->
        <div class="tryon-panel">
          <h3 style="font-family:var(--font-display);font-size:18px;margin-bottom:12px;">Step 1: Your Photo</h3>
          <div class="upload-zone" id="photoUploadZone">
            ${userPhoto
              ? `<img src="${userPhoto}" class="preview-img" alt="Your photo" style="max-height:280px;" />`
              : `<div class="upload-icon">📸</div><p>Upload a full-body photo to try on dresses</p>`}
          </div>
          <input type="file" id="photoInput" accept="image/*" style="display:none;" />

          <!-- Canvas Preview Result -->
          <div id="previewSection" style="${userPhoto ? "" : "display:none;"}">
            <h4 style="font-family:var(--font-display);font-size:15px;margin:20px 0 10px;">AI Preview Result</h4>
            <div class="tryon-canvas-wrap" id="canvasWrap">
              <canvas id="tryonCanvas" width="400" height="533"></canvas>
            </div>
          </div>
        </div>

        <!-- RIGHT: Product Selection -->
        <div class="tryon-panel">
          <h3 style="font-family:var(--font-display);font-size:18px;margin-bottom:12px;">Step 2: Select a Dress</h3>

          <div class="tryon-product-selector" id="productSelector">
            ${TRYON_PRODUCTS.map((p) => `
              <img src="${p.image}" alt="${p.name}" data-product-id="${p.id}"
                class="${selectedProduct.id === p.id ? "active" : ""}" />
            `).join("")}
          </div>

          <div id="productInfo" style="margin-top:16px;">
            <h4 style="font-family:var(--font-display);font-size:20px;">${selectedProduct.name}</h4>
            <p style="color:var(--muted);">${selectedProduct.category} · ${formatPrice(selectedProduct.price)}</p>
          </div>

          <!-- Color Selection -->
          <div style="margin-top:16px;">
            <label style="font-weight:600;font-size:13px;display:block;margin-bottom:8px;">Color</label>
            <div class="tryon-color-pills" id="colorPills">
              ${selectedProduct.colors.map((c) => `
                <div class="color-pill ${selectedColor === c ? "active" : ""}"
                  style="background:${colorMap[c] || "#ccc"};"
                  data-color="${c}" title="${c}"></div>
              `).join("")}
            </div>
            <span style="font-size:13px;color:var(--muted);margin-top:6px;display:block;" id="selectedColorLabel">${selectedColor}</span>
          </div>

          <!-- Size Selection -->
          <div style="margin-top:16px;">
            <label style="font-weight:600;font-size:13px;display:block;margin-bottom:8px;">Size</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${["XS","S","M","L","XL","XXL"].map((s) => `
                <button class="sort-chip ${selectedSize === s ? "active" : ""}" data-size="${s}" style="padding:6px 16px;">${s}</button>
              `).join("")}
            </div>
          </div>

          <!-- Compare Button -->
          <div style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary" id="generateBtn" ${userPhoto ? "" : "disabled"}>
              ✨ Generate Preview
            </button>
            <button class="btn btn-ghost" id="saveLookBtn" ${userPhoto ? "" : "disabled"}>
              💾 Save Look
            </button>
            <button class="btn btn-ghost" id="addCartBtn" ${userPhoto ? "" : "disabled"}>
              🛒 Add to Cart
            </button>
          </div>

          <!-- Saved Comparisons -->
          <div id="comparisonStrip" style="margin-top:20px;">
            <h4 style="font-family:var(--font-display);font-size:15px;margin-bottom:8px;">Saved Comparisons</h4>
            <div id="savedLooks" style="display:flex;gap:8px;overflow-x:auto;"></div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    if (userPhoto) generatePreview();
  }

  function bindEvents() {
    // Photo upload
    const zone = root.querySelector("#photoUploadZone");
    const input = root.querySelector("#photoInput");
    zone?.addEventListener("click", () => input.click());
    input?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        userPhoto = ev.target.result;
        render();
      };
      reader.readAsDataURL(file);
    });

    // Product selection
    root.querySelectorAll("#productSelector img").forEach((img) => {
      img.addEventListener("click", () => {
        selectedProduct = TRYON_PRODUCTS.find((p) => p.id === img.dataset.productId);
        selectedColor = selectedProduct.colors[0];
        render();
      });
    });

    // Color selection
    root.querySelectorAll("#colorPills .color-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        selectedColor = pill.dataset.color;
        root.querySelector("#selectedColorLabel").textContent = selectedColor;
        root.querySelectorAll("#colorPills .color-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        if (userPhoto) generatePreview();
      });
    });

    // Size selection
    root.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedSize = btn.dataset.size;
        root.querySelectorAll("[data-size]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // Generate preview
    root.querySelector("#generateBtn")?.addEventListener("click", () => generatePreview(true));
    root.querySelector("#saveLookBtn")?.addEventListener("click", saveLook);
    root.querySelector("#addCartBtn")?.addEventListener("click", addToCartFromTryOn);
  }

  function generatePreview(showToastMsg) {
    const canvas = document.getElementById("tryonCanvas");
    if (!canvas || !userPhoto) return;
    const ctx = canvas.getContext("2d");
    const colorHex = colorMap[selectedColor] || "#ccc";

    // Load user photo
    const userImg = new Image();
    userImg.onload = () => {
      // Draw user photo as background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f8f5f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the photo fitted
      const ratio = Math.min(canvas.width / userImg.width, canvas.height / userImg.height);
      const drawW = userImg.width * ratio;
      const drawH = userImg.height * ratio;
      ctx.drawImage(userImg, (canvas.width - drawW) / 2, 0, drawW, drawH);

      // Overlay dress color tint on lower half
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = colorHex;
      ctx.fillRect(
        canvas.width * 0.15,
        canvas.height * 0.25,
        canvas.width * 0.7,
        canvas.height * 0.6
      );
      ctx.globalAlpha = 1;

      // Draw product thumbnail in corner
      const prodImg = new Image();
      prodImg.crossOrigin = "anonymous";
      prodImg.onload = () => {
        ctx.save();
        const thumbSize = 100;
        ctx.fillStyle = "#fff";
        ctx.fillRect(canvas.width - thumbSize - 10, 10, thumbSize, thumbSize);
        ctx.drawImage(prodImg, canvas.width - thumbSize - 5, 15, thumbSize - 10, thumbSize - 10);
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width - thumbSize - 10, 10, thumbSize, thumbSize);
        ctx.restore();

        // Labels
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.fillText(`${selectedProduct.name}`, 16, canvas.height - 32);
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText(`${selectedColor} · Size ${selectedSize}`, 16, canvas.height - 10);
      };
      prodImg.src = selectedProduct.image;
    };
    userImg.src = userPhoto;

    if (showToastMsg) showToast("AI preview generated! ✨", "success");
  }

  let savedLooks = [];
  function saveLook() {
    const canvas = document.getElementById("tryonCanvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    savedLooks.unshift({
      img: dataUrl,
      product: selectedProduct.name,
      color: selectedColor,
      size: selectedSize,
      price: selectedProduct.price,
    });
    renderSavedLooks();
    showToast("Look saved to comparison!", "success");
  }

  function renderSavedLooks() {
    const el = root.querySelector("#savedLooks");
    if (!el) return;
    if (!savedLooks.length) {
      el.innerHTML = `<p style="color:var(--muted);font-size:13px;">No saved looks yet. Generate and save to compare.</p>`;
      return;
    }
    el.innerHTML = savedLooks.map((look) => `
      <div style="flex-shrink:0;text-align:center;">
        <img src="${look.img}" style="width:72px;height:96px;border-radius:10px;object-fit:cover;border:2px solid var(--line);" alt="${look.product}" />
        <p style="font-size:10px;color:var(--muted);margin-top:4px;">${look.color} ${look.size}</p>
      </div>
    `).join("");
  }

  function addToCartFromTryOn() {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to add to cart", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    TatitoStore.addToCart("try-on", selectedProduct.id, {
      name: `${selectedProduct.name} (${selectedColor}, ${selectedSize})`,
      price: selectedProduct.price,
      image: selectedProduct.image,
      variantType: "try-on",
      shopName: "AI Try-On",
      category: selectedProduct.category,
    }, `${selectedColor}-${selectedSize}`);
    showToast(`${selectedProduct.name} added to cart!`, "success");
  }

  render();
  renderSavedLooks();
});
