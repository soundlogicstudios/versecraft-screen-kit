/* ======================================================================
 * File: src/router.js
 * - Auto-discovers [data-screen] in DOM
 * ====================================================================== */
let currentScreen = "";

function knownScreens() {
  return new Set(
    Array.from(document.querySelectorAll("[data-screen]"))
      .map((el) => (el.getAttribute("data-screen") || "").trim())
      .filter(Boolean)
  );
}

function setActiveScreen(screenId) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  const next = document.querySelector(`[data-screen="${screenId}"]`);
  if (next) next.classList.add("active");
}

export function initRouter({ defaultScreen = "splash" } = {}) {
  const screens = knownScreens();
  const hash = (location.hash || "").replace("#", "").trim();

  currentScreen = screens.has(hash) ? hash : (screens.has(defaultScreen) ? defaultScreen : "");
  if (currentScreen) {
    setActiveScreen(currentScreen);
    history.replaceState(null, "", `#${currentScreen}`);
  }
}

export function go(screenId, state = null) {
  const screens = knownScreens();
  if (!screens.has(screenId)) return;

  const from = currentScreen;
  const to = screenId;
  currentScreen = to;

  setActiveScreen(to);
  history.replaceState(null, "", `#${to}`);

  window.dispatchEvent(
    new CustomEvent("versecraft:navigate", {
      detail: { from, to, state },
    })
  );
}

export function getCurrentScreen() {
  return currentScreen;
}

