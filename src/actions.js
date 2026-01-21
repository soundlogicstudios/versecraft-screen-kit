/* ======================================================================
 * File: src/actions.js
 * - One global click handler for all hitboxes
 * ====================================================================== */
import { go } from "./router.js";
import { selectStory, getSelection } from "./state.js";

function closestActionEl(target) {
  if (!(target instanceof Element)) return null;
  return target.closest("[data-action]");
}

export function initActionDispatcher({
  screenIdForStory,
  storyJsonPath,
  saveKey,
} = {}) {
  document.addEventListener("click", (e) => {
    const el = closestActionEl(e.target);
    if (!el) return;

    e.preventDefault();
    e.stopPropagation();

    const action = (el.getAttribute("data-action") || "").trim();

    if (action === "go") {
      const target = (el.getAttribute("data-target") || "").trim();
      if (target) go(target);
      return;
    }

    if (action === "selectStory") {
      const storyId = (el.getAttribute("data-story-id") || "").trim();
      const packId = (el.getAttribute("data-pack-id") || "").trim();
      if (!storyId || !packId) return;

      selectStory({ storyId, packId });
      go("launcher");
      return;
    }

    if (action === "startStory") {
      const sel = getSelection();
      if (!sel || !screenIdForStory || !storyJsonPath || !saveKey) return;

      const { storyId, packId } = sel;
      const targetScreen = screenIdForStory(packId, storyId);

      fetch(storyJsonPath(packId, storyId), { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          const start = data.start || data.startNodeId || "S01";
          try {
            localStorage.removeItem(saveKey(packId, storyId));
            localStorage.setItem("vc_story_cursor", start);
          } catch {
            // ignore
          }
          go(targetScreen);
        })
        .catch(() => go(targetScreen));
      return;
    }

    if (action === "continueStory") {
      const sel = getSelection();
      if (!sel || !screenIdForStory || !saveKey) return;

      const { storyId, packId } = sel;
      const targetScreen = screenIdForStory(packId, storyId);

      let save = null;
      try {
        save = localStorage.getItem(saveKey(packId, storyId));
      } catch {
        save = null;
      }

      if (!save) {
        alert("No save found for this story yet.");
        return;
      }

      try {
        localStorage.setItem("vc_active_save", save);
      } catch {
        // ignore
      }

      go(targetScreen);
    }
  });
}
