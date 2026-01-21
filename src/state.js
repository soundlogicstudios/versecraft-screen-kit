/* ======================================================================
 * File: src/state.js
 * ====================================================================== */
const KEY_SELECTED_STORY = "vc_selected_story";
const KEY_SELECTED_PACK = "vc_selected_pack";

export function selectStory({ storyId, packId }) {
  try {
    localStorage.setItem(KEY_SELECTED_STORY, storyId);
    localStorage.setItem(KEY_SELECTED_PACK, packId);
  } catch {
    // ignore
  }
}

export function getSelection() {
  try {
    const storyId = localStorage.getItem(KEY_SELECTED_STORY);
    const packId = localStorage.getItem(KEY_SELECTED_PACK);
    if (!storyId || !packId) return null;
    return { storyId, packId };
  } catch {
    return null;
  }
}
