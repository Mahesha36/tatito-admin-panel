/* =========================================================
   location.js — Splash, geolocation, reverse geocoding,
   city selection, and persistence.
   Only runs on index.html (checks for splash element).
   ========================================================= */

const STORAGE_KEY = "tatito_location";
const REVERSE_GEOCODE_URL = (lat, lon) =>
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

function saveLocation(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  addRecentCity(data.city);
}
function getSavedLocation() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function addRecentCity(city) {
  if (!city) return;
  let recents = JSON.parse(localStorage.getItem("tatito_recent_cities") || "[]");
  recents = [city, ...recents.filter((c) => c !== city)].slice(0, 4);
  localStorage.setItem("tatito_recent_cities", JSON.stringify(recents));
}
function getRecentCities() {
  return JSON.parse(localStorage.getItem("tatito_recent_cities") || "[]");
}

function showSplash() { document.getElementById("splash")?.classList.remove("fade-out"); }
function hideSplash() {
  const s = document.getElementById("splash");
  if (!s) return;
  s.classList.add("fade-out");
  setTimeout(() => s.classList.add("hidden"), 700);
}
function showLocationModal() { document.getElementById("locationModal")?.classList.remove("hidden"); }
function hideLocationModal() { document.getElementById("locationModal")?.classList.add("hidden"); }
function showCityScreen() {
  document.getElementById("cityScreen")?.classList.remove("hidden");
  renderCityLists();
}
function hideCityScreen() { document.getElementById("cityScreen")?.classList.add("hidden"); }

function showMainSite(locationData) {
  hideLocationModal();
  hideCityScreen();
  document.getElementById("mainSite")?.classList.remove("hidden");
  applyLocationToUI(locationData);
}

function applyLocationToUI(data) {
  const label = data.city ? `${data.city}${data.state ? ", " + data.state : ""}` : t("yourCity");
  const pill = document.getElementById("locationPillText");
  if (pill) pill.textContent = data.city || t("selectCity");
  const heroLoc = document.getElementById("heroLocationText");
  if (heroLoc) heroLoc.textContent = label;
  const nearbyLoc = document.getElementById("nearbyLocationText");
  if (nearbyLoc) nearbyLoc.textContent = data.city || t("yourArea");
  const heroSearchLoc = document.getElementById("heroSearchLocationText");
  if (heroSearchLoc) heroSearchLoc.textContent = data.city || t("selectCity");
}

function requestBrowserLocation() {
  const status = document.getElementById("locationStatus");
  if (!status) return;
  if (!("geolocation" in navigator)) {
    status.textContent = t("geoUnsupported");
    return;
  }
  status.textContent = t("locating");
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const place = await reverseGeocode(latitude, longitude);
        const data = { lat: latitude, lng: longitude, city: place.city, state: place.state, country: place.country, source: "gps" };
        saveLocation(data);
        showMainSite(data);
      } catch {
        status.textContent = t("cityNotFound");
        setTimeout(() => { hideLocationModal(); showCityScreen(); }, 900);
      }
    },
    (error) => {
      status.textContent = t("locationDenied");
      setTimeout(() => { hideLocationModal(); showCityScreen(); }, 900);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

async function reverseGeocode(lat, lon) {
  const res = await fetch(REVERSE_GEOCODE_URL(lat, lon), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Geocoding failed");
  const json = await res.json();
  const addr = json.address || {};
  return {
    city: addr.city || addr.town || addr.village || addr.county || "Your Area",
    state: addr.state || "",
    country: addr.country || ""
  };
}

function selectCity(cityName) {
  const data = { city: cityName, source: "manual" };
  saveLocation(data);
  showMainSite(data);
}

function renderCityLists() {
  const popularWrap = document.getElementById("popularCityList");
  if (popularWrap) {
    popularWrap.innerHTML = POPULAR_CITIES.map((c) => `<button class="city-chip" data-city="${c}">${c}</button>`).join("");
  }
  const recents = getRecentCities();
  const recentWrap = document.getElementById("recentCityWrap");
  if (recentWrap) {
    if (recents.length) {
      recentWrap.classList.remove("hidden");
      document.getElementById("recentCityList").innerHTML = recents
        .map((c) => `<button class="city-chip current" data-city="${c}">${c}</button>`).join("");
    } else {
      recentWrap.classList.add("hidden");
    }
  }
  document.querySelectorAll(".city-chip").forEach((btn) => {
    btn.addEventListener("click", () => selectCity(btn.dataset.city));
  });
}

function setupCitySearch() {
  const input = document.getElementById("citySearchInput");
  const suggestions = document.getElementById("citySuggestions");
  if (!input || !suggestions) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { suggestions.classList.add("hidden"); suggestions.innerHTML = ""; return; }
    const matches = POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q));
    if (!matches.length) { suggestions.classList.add("hidden"); return; }
    suggestions.innerHTML = matches.map((c) => `<li data-city="${c}">${c}</li>`).join("");
    suggestions.classList.remove("hidden");
    suggestions.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => selectCity(li.dataset.city));
    });
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) selectCity(input.value.trim());
  });
}

function initLocationFlow() {
  // Only on index.html
  const splash = document.getElementById("splash");
  if (!splash) return;

  setupCitySearch();
  document.getElementById("allowLocationBtn")?.addEventListener("click", requestBrowserLocation);
  document.getElementById("manualCityBtn")?.addEventListener("click", () => { hideLocationModal(); showCityScreen(); });
  document.getElementById("closeCityScreen")?.addEventListener("click", () => {
    hideCityScreen();
    if (!getSavedLocation()) showLocationModal();
  });

  const saved = getSavedLocation();
  setTimeout(() => {
    hideSplash();
    if (saved && saved.city) {
      document.getElementById("mainSite")?.classList.remove("hidden");
      applyLocationToUI(saved);
    } else {
      showLocationModal();
    }
  }, 1900);
}

document.addEventListener("DOMContentLoaded", initLocationFlow);
