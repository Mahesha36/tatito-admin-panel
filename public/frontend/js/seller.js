/* =========================================================
   seller.js — Seller & Service Provider Registration
   Multi-step: Category → Business Profile → Documents → Fee → Submit
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "seller-register") return;

  let currentStep = 1;
  const totalSteps = 4;
  const formData = { selectedCategory: null, documents: [] };

  const stepLabels = ["Category", "Business Profile", "Documents", "Review & Submit"];

  function renderStepIndicator() {
    const el = document.getElementById("sellerStepIndicator");
    if (!el) return;
    let html = "";
    for (let i = 1; i <= totalSteps; i++) {
      const cls = i === currentStep ? "active" : i < currentStep ? "completed" : "";
      const txt = i < currentStep ? "✓" : i;
      html += `<div class="form-step-dot ${cls}">${txt}</div>`;
      if (i < totalSteps) html += `<div class="form-step-connector ${i < currentStep ? "completed" : ""}"></div>`;
    }
    el.innerHTML = html;
  }

  function renderForm() {
    const container = document.getElementById("sellerFormContainer");
    if (!container) return;
    renderStepIndicator();

    if (currentStep === 1) renderStep1(container);
    else if (currentStep === 2) renderStep2(container);
    else if (currentStep === 3) renderStep3(container);
    else if (currentStep === 4) renderStep4(container);
  }

  function renderStep1(el) {
    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Select Your Business Category</h2>
        <p style="color:var(--muted);margin-bottom:16px;">Choose the category that best describes your business or service.</p>
        <div class="category-select-grid">
          ${SELLER_CATEGORIES.map((cat) => `
            <div class="category-select-card ${formData.selectedCategory === cat.id ? "selected" : ""}" data-cat-id="${cat.id}">
              <span class="emoji">${cat.emoji}</span>
              <h4>${cat.label}</h4>
              <p>${cat.description}</p>
            </div>
          `).join("")}
        </div>
        <div style="margin-top:24px;display:flex;gap:8px;">
          <button class="btn btn-primary" id="sellerNextBtn" ${formData.selectedCategory ? "" : "disabled"}>Next →</button>
        </div>
      </div>
    `;

    el.querySelectorAll(".category-select-card").forEach((card) => {
      card.addEventListener("click", () => {
        formData.selectedCategory = card.dataset.catId;
        renderForm();
      });
    });

    el.querySelector("#sellerNextBtn")?.addEventListener("click", () => {
      if (formData.selectedCategory) { currentStep++; renderForm(); }
    });
  }

  function renderStep2(el) {
    const user = TatitoStore.getUser();
    const cat = SELLER_CATEGORIES.find((c) => c.id === formData.selectedCategory);
    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Business Profile</h2>
        <p style="color:var(--muted);margin-bottom:16px;">Category: <strong>${cat?.emoji} ${cat?.label}</strong></p>
        <form id="businessProfileForm">
          <div class="form-row">
            <div class="form-field">
              <label>Business / Shop Name *</label>
              <input type="text" name="businessName" required />
            </div>
            <div class="form-field">
              <label>Owner Full Name *</label>
              <input type="text" name="ownerName" value="${escapeHtml(user.name || "")}" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>Email *</label>
              <input type="email" name="email" value="${escapeHtml(user.email || "")}" required />
            </div>
            <div class="form-field">
              <label>Mobile Number *</label>
              <input type="tel" name="phone" placeholder="10-digit mobile number" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>City *</label>
              <input type="text" name="city" placeholder="e.g. Mumbai" required />
            </div>
            <div class="form-field">
              <label>Business Address *</label>
              <input type="text" name="address" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label>GST Number (if applicable)</label>
              <input type="text" name="gst" placeholder="22AAAAA0000A1Z5" />
            </div>
            <div class="form-field">
              <label>PAN Number</label>
              <input type="text" name="pan" placeholder="ABCDE1234F" />
            </div>
          </div>
          <div class="form-field">
            <label>Business Description</label>
            <textarea name="description" rows="3" placeholder="Tell customers about your business, specialties, and experience..."></textarea>
          </div>
          <div style="margin-top:20px;display:flex;gap:8px;">
            <button type="button" class="btn btn-ghost" id="sellerBackBtn">← Back</button>
            <button type="submit" class="btn btn-primary">Next →</button>
          </div>
        </form>
      </div>
    `;

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#businessProfileForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      Object.assign(formData, Object.fromEntries(new FormData(e.target).entries()));
      currentStep++;
      renderForm();
    });
  }

  function renderStep3(el) {
    const docTypes = [
      { id: "gst-cert", label: "GST Certificate", req: "optional" },
      { id: "trade-license", label: "Trade License", req: "optional" },
      { id: "id-proof", label: "Owner ID Proof (Aadhaar/PAN)", req: "required" },
      { id: "shop-photo", label: "Shop / Studio Photo", req: "optional" },
    ];
    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Upload Documents</h2>
        <p style="color:var(--muted);margin-bottom:16px;">Upload your documents for verification. Files are stored securely.</p>
        ${docTypes.map((doc) => `
          <div style="margin-bottom:16px;">
            <label style="font-weight:600;display:flex;align-items:center;gap:8px;">
              ${doc.label}
              <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:${doc.req === "required" ? "rgba(125,17,40,0.1)" : "var(--line)"};color:${doc.req === "required" ? "var(--ruby)" : "var(--muted)"};">${doc.req}</span>
            </label>
            <div class="upload-zone" data-doc-id="${doc.id}" style="padding:20px;margin-top:8px;">
              <div class="upload-icon">📄</div>
              <p>Click to upload or drag &amp; drop</p>
              <input type="file" class="hidden-file-input" accept="image/*,.pdf" style="display:none;" />
              <div class="upload-preview" data-preview-for="${doc.id}"></div>
            </div>
          </div>
        `).join("")}
        <div style="margin-top:20px;display:flex;gap:8px;">
          <button type="button" class="btn btn-ghost" id="sellerBackBtn">← Back</button>
          <button type="button" class="btn btn-primary" id="sellerNextBtn">Next →</button>
        </div>
      </div>
    `;

    el.querySelectorAll(".upload-zone").forEach((zone) => {
      const input = zone.querySelector(".hidden-file-input");
      const docId = zone.dataset.docId;
      zone.addEventListener("click", () => input.click());
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          formData.documents.push({ id: docId, name: file.name, dataUrl: ev.target.result });
          const preview = zone.querySelector(`[data-preview-for="${docId}"]`);
          preview.innerHTML = `<img src="${ev.target.result}" class="preview-thumb" alt="${docId}" />`;
          zone.querySelector("p").textContent = `✓ ${file.name}`;
          showToast("Document uploaded", "success");
        };
        reader.readAsDataURL(file);
      });
    });

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#sellerNextBtn")?.addEventListener("click", () => { currentStep++; renderForm(); });
  }

  function renderStep4(el) {
    const cat = SELLER_CATEGORIES.find((c) => c.id === formData.selectedCategory);
    const regFee = 499;

    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Review &amp; Submit</h2>
        <p style="color:var(--muted);margin-bottom:16px;">Please review your information before submitting.</p>

        <div style="background:var(--ivory);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:var(--muted);">Category</span>
            <strong>${cat?.emoji} ${cat?.label}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:var(--muted);">Business Name</span>
            <strong>${escapeHtml(formData.businessName || "")}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:var(--muted);">Owner</span>
            <strong>${escapeHtml(formData.ownerName || "")}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:var(--muted);">Mobile</span>
            <strong>${escapeHtml(formData.phone || "")}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:var(--muted);">City</span>
            <strong>${escapeHtml(formData.city || "")}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:var(--muted);">Documents Uploaded</span>
            <strong>${formData.documents.length} file(s)</strong>
          </div>
        </div>

        <div class="cost-estimate-box">
          <h4>📋 Registration Fee</h4>
          <div class="cost-estimate-row"><span>Registration Fee (one-time)</span><span>${formatPrice(regFee)}</span></div>
          <div class="cost-estimate-row"><span>GST (18%)</span><span>${formatPrice(Math.round(regFee * 0.18))}</span></div>
          <div class="cost-estimate-row"><span>Total Payable</span><span>${formatPrice(Math.round(regFee * 1.18))}</span></div>
        </div>

        <div style="background:rgba(0,128,0,0.05);border:1px solid rgba(0,128,0,0.2);border-radius:12px;padding:14px;margin-bottom:16px;">
          <p style="font-size:13px;color:#2d6a2d;">✓ After submission, the Tatito admin team will verify your application. You'll receive a notification once approved. Only approved sellers can publish products or services.</p>
        </div>

        <div style="display:flex;gap:8px;">
          <button type="button" class="btn btn-ghost" id="sellerBackBtn">← Back</button>
          <button type="button" class="btn btn-primary" id="sellerSubmitBtn">Pay ${formatPrice(Math.round(regFee * 1.18))} &amp; Submit</button>
        </div>
      </div>
    `;

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#sellerSubmitBtn")?.addEventListener("click", () => {
      const btn = el.querySelector("#sellerSubmitBtn");
      btn.textContent = "Processing..."; btn.disabled = true;

      const app = TatitoStore.addSellerApp({
        category: formData.selectedCategory,
        categoryLabel: cat?.label,
        ...formData
      });

      TatitoStore.addNotification({
        title: "Registration Submitted",
        message: `Your seller registration for "${formData.businessName}" has been submitted. Admin verification in progress.`,
        type: "seller",
        icon: "🏪"
      });

      // Simulate admin approval after 3 seconds
      setTimeout(() => {
        TatitoStore.addNotification({
          title: "Seller Approved! 🎉",
          message: `Congratulations! Your seller account for "${formData.businessName}" has been approved. You can now publish products and services.`,
          type: "seller",
          icon: "✅"
        });
        showToast("Registration approved! Check notifications.", "success");
      }, 3000);

      showToast("Registration submitted! Verification pending.", "success");
      setTimeout(() => { window.location.href = "notifications.html"; }, 1500);
    });
  }

  renderForm();
});
