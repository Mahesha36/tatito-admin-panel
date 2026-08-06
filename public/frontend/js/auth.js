/* =========================================================
   auth.js — Login & Register pages.
   Mock auth (localStorage). Logo intro animation preserved.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("loginLogoIntro");
  const card = document.querySelector(".auth-card");

  if (intro && card) {
    card.classList.add("is-hidden");
    setTimeout(() => {
      intro.classList.add("is-hidden");
      card.classList.remove("is-hidden");
    }, 1200);
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const name = (formData.get("email") || "").split("@")[0];
      const btn = loginForm.querySelector("button[type='submit']");
      if (btn) { btn.textContent = t("loggingIn"); btn.disabled = true; }

      TatitoStore.login({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: formData.get("email"),
        phone: "",
        createdAt: new Date().toISOString()
      });

      showToast(t("loginSuccess"), "success");
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const btn = registerForm.querySelector("button[type='submit']");
      if (btn) { btn.textContent = t("registering"); btn.disabled = true; }

      TatitoStore.login({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: "",
        createdAt: new Date().toISOString()
      });

      showToast(t("registerSuccess"), "success");
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    });
  }
});
