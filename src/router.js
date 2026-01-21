/* ======================================================================
 * File: src/router.js
 * FULL REPLACEMENT (copy/paste)
 * ====================================================================== */
// VerseCraft Router v0.0.05+
// - Responsible ONLY for switching screens (single-screen active)
// - Auto-discovers screens via [data-screen] (supports manifest-generated screens)

let _current = (location.hash || "").replace("#", "").trim();

function getKnownScreens() {
  return new Set(
    Array.from(document.querySelectorAll("[data-screen]"))
      .map((el) => (el.getAttribute("data-screen") || "").trim())
      .filter(Boolean)
  );
}

function ensureValidCurrent(defaultScreen = "splash") {
  const screens = getKnownScreens();
  if (!_current || !screens.has(_current)) _current = defaultScreen;
}

export function initRouter(defaultScreen = "splash") {
  // Allow direct linking via hash (#splash, #tos, #menu, #story__starter__world_of_lorecraft, etc.)
  const hash = (location.hash || "").replace("#", "").trim();
  const screens = getKnownScreens();

  if (hash && screens.has(hash)) {
    requestAnimationFrame(() => go(hash));
    return;
  }

  ensureValidCurrent(defaultScreen);
  requestAnimationFrame(() => go(_current));
}

export function getCurrentScreen() {
  return _current;
}

export function go(screenId) {
  const screens = getKnownScreens();
  if (!screens.has(screenId)) return;

  const from = _current;
  const to = screenId;
  _current = to;

  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const next = document.querySelector(`[data-screen="${screenId}"]`);
  if (next) next.classList.add("active");

  history.replaceState(null, "", `#${screenId}`);

  window.dispatchEvent(
    new CustomEvent("versecraft:navigate", {
      detail: { from, to },
    })
  );
}

