/* ======================================================================
 * File: src/screen-manager.js
 * - Builds story screens from manifest + template
 * ====================================================================== */
function interpolate(templateHtml, vars) {
  return templateHtml.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ""));
}

export async function buildStoryScreens({
  manifestUrl = "./content/story_screens_manifest.json",
} = {}) {
  const res = await fetch(manifestUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Manifest HTTP ${res.status}`);

  const manifest = await res.json();
  const container = document.getElementById(manifest.containerId || "screensContainer");
  const tpl = document.getElementById(manifest.storyTemplateId || "tplStoryScreen");

  if (!container) throw new Error("Screens container not found.");
  if (!tpl) throw new Error("Story template not found.");
  if (!Array.isArray(manifest.stories)) throw new Error("Manifest missing stories[].");

  const templateHtml = tpl.innerHTML;

  const createdScreenIds = [];

  for (const story of manifest.stories) {
    const packId = String(story.packId || "").trim();
    const storyId = String(story.storyId || "").trim();
    const title = String(story.title || storyId).trim();

    if (!packId || !storyId) continue;

    const screenId = `story__${packId}__${storyId}`;
    createdScreenIds.push(screenId);

    const panelBg = story.assets?.panelBg || "";
    const soundtrack = story.assets?.soundtrack || "";

    const html = interpolate(templateHtml, {
      SCREEN_ID: screenId,
      PACK_ID: packId,
      STORY_ID: storyId,
      TITLE: title,
      PANEL_BG: panelBg,
      SOUNDTRACK: soundtrack,
    });

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    const section = wrapper.firstElementChild;
    if (!section) continue;

    container.appendChild(section);
  }

  return { createdScreenIds };
}
